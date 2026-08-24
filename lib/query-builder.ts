import pool from './db';

// Column/table names are interpolated directly into SQL strings (values are
// always parameterized separately). Since some routes build `data`/`fields`
// from request bodies, every identifier that reaches SQL must be validated
// against this allow-list shape before use — otherwise a crafted key
// (e.g. containing a backtick) could break out of the identifier and inject
// arbitrary SQL.
const SAFE_IDENT = /^[A-Za-z0-9_]+$/;
function ident(name: string): string {
  if (typeof name !== 'string' || !SAFE_IDENT.test(name)) {
    throw new Error(`Invalid identifier: ${JSON.stringify(name)}`);
  }
  return name;
}

type Cond = { sql: string; val: any };

export const db = {
  from: (table: string) => {
    ident(table);
    return {
      select: (columns: string = '*', options?: any) => {
        // Multiple .order() calls chain into a compound ORDER BY.
        const sorts: { col: string; asc: boolean }[] = [];
        const conds: Cond[] = [];
        let limitVal: number | null = null;
        let isSingle = false;

        const build = (withOrder: boolean) => {
          let sql = `SELECT * FROM \`${table}\``;
          if (conds.length) sql += ' WHERE ' + conds.map(c => c.sql).join(' AND ');
          if (withOrder && sorts.length) {
            sql += ' ORDER BY ' + sorts
              .map(s => `\`${ident(s.col)}\` ${s.asc ? 'ASC' : 'DESC'}`)
              .join(', ');
          }
          // limitVal is coerced to a non-negative integer before interpolation.
          if (limitVal !== null) sql += ` LIMIT ${limitVal}`;
          return sql;
        };

        const chain = {
          order: (col: string, opts: { ascending?: boolean } = {}) => {
            sorts.push({ col, asc: opts.ascending !== false });
            return chain;
          },
          eq: (col: string, val: any) => {
            conds.push({ sql: `\`${ident(col)}\` = ?`, val });
            return chain;
          },
          gt: (col: string, val: any) => {
            conds.push({ sql: `\`${ident(col)}\` > ?`, val });
            return chain;
          },
          limit: (val: number) => {
            const n = Number(val);
            limitVal = Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
            return chain;
          },
          single: async () => {
            isSingle = true;
            return chain.execute();
          },
          then: (resolve: any, reject: any) => {
            chain.execute().then(resolve).catch(reject);
          },
          execute: async () => {
            const queryArgs = conds.map(c => c.val);

            const run = async (withOrder: boolean) =>
              (await pool.query(build(withOrder), queryArgs))[0] as any;

            try {
              let rows: any;
              try {
                rows = await run(true);
              } catch (err: any) {
                // A sort column that does not exist in this schema should not
                // blank the whole page — retry unsorted and warn.
                if (err?.code === 'ER_BAD_FIELD_ERROR' && sorts.length) {
                  console.warn(
                    `[query-builder] ${table}: unknown sort column ` +
                    `(${sorts.map(s => s.col).join(', ')}) — returning unsorted rows`,
                  );
                  rows = await run(false);
                } else {
                  throw err;
                }
              }

              if (isSingle) return { data: rows.length > 0 ? rows[0] : null, error: null };
              if (options?.count === 'exact') return { data: rows, count: rows.length, error: null };
              return { data: rows, error: null };
            } catch (error) {
              console.error(`Error querying table ${table}:`, error);
              if (isSingle) return { data: null, error };
              return { data: [], count: 0, error };
            }
          },
        };
        return chain;
      },

      update: (data: Record<string, any>) => {
        const conds: Cond[] = [];
        const chain = {
          eq: (col: string, val: any) => { conds.push({ sql: `\`${ident(col)}\` = ?`, val }); return chain; },
          neq: (col: string, val: any) => { conds.push({ sql: `\`${ident(col)}\` != ?`, val }); return chain; },
          then: (resolve: any, reject: any) => { chain.execute().then(resolve).catch(reject); },
          execute: async () => {
            try {
              const keys = Object.keys(data);
              if (!keys.length) return { error: null };
              const setClauses = keys.map(k => `\`${ident(k)}\` = ?`).join(', ');
              const values = keys.map(k => data[k]);
              let sql = `UPDATE \`${table}\` SET ${setClauses}`;
              if (conds.length) {
                sql += ' WHERE ' + conds.map(c => c.sql).join(' AND ');
                values.push(...conds.map(c => c.val));
              }
              await pool.query(sql, values);
              return { error: null };
            } catch (err: any) {
              console.error(`Error updating table ${table}:`, err);
              return { error: err };
            }
          },
        };
        return chain;
      },

      delete: () => {
        const conds: Cond[] = [];
        const chain = {
          eq: (col: string, val: any) => { conds.push({ sql: `\`${ident(col)}\` = ?`, val }); return chain; },
          then: (resolve: any, reject: any) => { chain.execute().then(resolve).catch(reject); },
          execute: async () => {
            try {
              const values: any[] = [];
              let sql = `DELETE FROM \`${table}\``;
              if (conds.length) {
                sql += ' WHERE ' + conds.map(c => c.sql).join(' AND ');
                values.push(...conds.map(c => c.val));
              }
              await pool.query(sql, values);
              return { error: null };
            } catch (err: any) {
              console.error(`Error deleting from table ${table}:`, err);
              return { error: err };
            }
          },
        };
        return chain;
      },

      insert: (data: Record<string, any> | Record<string, any>[]) => {
        const rows = Array.isArray(data) ? data : [data];
        const chain = {
          select: () => chain,
          single: async () => chain.execute(),
          then: (resolve: any, reject: any) => { chain.execute().then(resolve).catch(reject); },
          execute: async () => {
            try {
              if (!rows.length) return { data: null, error: null };

              // Column set is taken from the first row; every row is written
              // with that same set so the multi-row VALUES stays well-formed.
              const keys = Object.keys(rows[0]).map(ident);
              const cols = keys.map(k => `\`${k}\``).join(', ');
              const tuple = `(${keys.map(() => '?').join(', ')})`;
              const values = rows.flatMap(r => keys.map(k => r[k] ?? null));

              const [result]: any = await pool.query(
                `INSERT INTO \`${table}\` (${cols}) VALUES ${rows.map(() => tuple).join(', ')}`,
                values,
              );

              // Read the row back so callers get the stored representation.
              // Auto-increment tables expose insertId; tables keyed by an
              // explicit id/slug are looked up by the value we just wrote.
              const pk = keys.includes('id') ? 'id' : keys.includes('slug') ? 'slug' : null;
              if (rows.length === 1) {
                if (result?.insertId) {
                  const [back]: any = await pool.query(
                    `SELECT * FROM \`${table}\` WHERE id = ?`, [result.insertId],
                  );
                  if (back[0]) return { data: back[0], error: null };
                }
                if (pk) {
                  const [back]: any = await pool.query(
                    `SELECT * FROM \`${table}\` WHERE \`${pk}\` = ?`, [rows[0][pk]],
                  );
                  if (back[0]) return { data: back[0], error: null };
                }
                return { data: rows[0], error: null };
              }
              return { data: rows, error: null };
            } catch (err: any) {
              console.error(`Error inserting into table ${table}:`, err);
              return { data: null, error: err };
            }
          },
        };
        return chain;
      },

      upsert: async (
        data: Record<string, any> | Record<string, any>[],
        _opts?: { onConflict?: string },
      ) => {
        try {
          const rows = Array.isArray(data) ? data : [data];
          if (!rows.length) return { error: null };

          const keys = Object.keys(rows[0]).map(ident);
          const cols = keys.map(k => `\`${k}\``).join(', ');
          const tuple = `(${keys.map(() => '?').join(', ')})`;
          const values = rows.flatMap(r => keys.map(k => r[k] ?? null));
          const updates = keys.map(k => `\`${k}\` = VALUES(\`${k}\`)`).join(', ');

          await pool.query(
            `INSERT INTO \`${table}\` (${cols}) VALUES ${rows.map(() => tuple).join(', ')} ` +
            `ON DUPLICATE KEY UPDATE ${updates}`,
            values,
          );
          return { error: null };
        } catch (err: any) {
          console.error(`Error upserting into table ${table}:`, err);
          return { error: err };
        }
      },
    };
  },

  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
} as any;

export const dbAdmin = db;
