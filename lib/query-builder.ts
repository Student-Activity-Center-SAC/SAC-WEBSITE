import pool from './db';

export const db = {
  from: (table: string) => {
    return {
      select: (columns: string = '*', options?: any) => {
        let queryStr = `SELECT * FROM \`${table}\``;
        let queryArgs: any[] = [];

        let sortColumn: string | null = null;
        let isAscending = true;
        let eqColumn: string | null = null;
        let eqValue: any = null;
        let limitVal: number | null = null;
        let isSingle = false;

        const chain = {
          order: (col: string, opts: { ascending?: boolean } = {}) => {
            sortColumn = col;
            if (opts.ascending === false) isAscending = false;
            return chain;
          },
          eq: (col: string, val: any) => {
            eqColumn = col;
            eqValue = val;
            return chain;
          },
          gt: (_col: string, _val: any) => chain,
          limit: (val: number) => {
            limitVal = val;
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
            try {
              if (eqColumn) {
                queryStr += ` WHERE \`${eqColumn}\` = ?`;
                queryArgs.push(eqValue);
              }
              if (sortColumn) {
                queryStr += ` ORDER BY \`${sortColumn}\` ${isAscending ? 'ASC' : 'DESC'}`;
              }
              if (limitVal !== null) {
                queryStr += ` LIMIT ${limitVal}`;
              }

              const [rows]: any = await pool.query(queryStr, queryArgs);

              if (isSingle) {
                return { data: rows.length > 0 ? rows[0] : null, error: null };
              }

              const count = rows.length;
              if (options?.count === 'exact') {
                return { data: rows, count, error: null };
              }
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
        let eqCol: string | null = null;
        let eqVal: any = null;
        const chain = {
          eq: (col: string, val: any) => { eqCol = col; eqVal = val; return chain; },
          then: (resolve: any, reject: any) => { chain.execute().then(resolve).catch(reject); },
          execute: async () => {
            try {
              const keys = Object.keys(data);
              if (!keys.length) return { error: null };
              const setClauses = keys.map(k => `\`${k}\` = ?`).join(', ');
              const values = [...keys.map(k => data[k])];
              let sql = `UPDATE \`${table}\` SET ${setClauses}`;
              if (eqCol) { sql += ` WHERE \`${eqCol}\` = ?`; values.push(eqVal); }
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
        let eqCol: string | null = null;
        let eqVal: any = null;
        const chain = {
          eq: (col: string, val: any) => { eqCol = col; eqVal = val; return chain; },
          then: (resolve: any, reject: any) => { chain.execute().then(resolve).catch(reject); },
          execute: async () => {
            try {
              const values: any[] = [];
              let sql = `DELETE FROM \`${table}\``;
              if (eqCol) { sql += ` WHERE \`${eqCol}\` = ?`; values.push(eqVal); }
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
              const row = rows[0];
              const keys = Object.keys(row);
              const cols = keys.map(k => `\`${k}\``).join(', ');
              const placeholders = keys.map(() => '?').join(', ');
              const values = keys.map(k => row[k]);
              const [result]: any = await pool.query(
                `INSERT INTO \`${table}\` (${cols}) VALUES (${placeholders})`, values
              );
              const [newRows]: any = await pool.query(
                `SELECT * FROM \`${table}\` WHERE id = ?`, [result.insertId]
              );
              return { data: newRows[0] ?? null, error: null };
            } catch (err: any) {
              console.error(`Error inserting into table ${table}:`, err);
              return { data: null, error: err };
            }
          },
        };
        return chain;
      },

      upsert: async (data: Record<string, any>, _opts?: { onConflict?: string }) => {
        try {
          const keys = Object.keys(data);
          const cols = keys.map(k => `\`${k}\``).join(', ');
          const placeholders = keys.map(() => '?').join(', ');
          const values = keys.map(k => data[k]);
          const updates = keys.map(k => `\`${k}\` = VALUES(\`${k}\`)`).join(', ');
          await pool.query(
            `INSERT INTO \`${table}\` (${cols}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`,
            values
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
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
} as any;

export const dbAdmin = db;
