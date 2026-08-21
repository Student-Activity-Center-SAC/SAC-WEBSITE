import pool from './db';

// A mock Database client that actually queries MySQL
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
          gt: (col: string, val: any) => {
            return chain; // Ignore gt for simplicity
          },
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
              
              let count = rows.length;
              if (options?.count === 'exact') {
                return { data: rows, count, error: null };
              }
              return { data: rows, error: null };
            } catch (error) {
              console.error(`Error querying table ${table}:`, error);
              if (isSingle) return { data: null, error };
              return { data: [], count: 0, error };
            }
          }
        };
        return chain;
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
    })
  }
} as any;

export const dbAdmin = db;
