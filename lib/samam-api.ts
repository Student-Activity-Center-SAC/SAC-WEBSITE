import https from 'https';

export async function fetchSamamActivities(endpoint: '/api/public/activities/completed' | '/api/public/activities/upcoming', timeoutMs = 3000): Promise<any> {
  const tryHost = (host: string, port: number, serverName: string) => {
    return new Promise((resolve, reject) => {
      const req = https.get({
        host,
        port,
        path: endpoint,
        headers: {
          'Host': serverName,
        },
        rejectUnauthorized: false,
        servername: serverName,
        timeout: timeoutMs,
      }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          try {
            const data = Buffer.concat(chunks).toString('utf8');
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  };

  try {
    // Attempt local loopback first (bypasses Hairpin NAT)
    return await tryHost('127.0.0.1', 443, 'sacactivities.kluniversity.in');
  } catch (err: any) {
    console.error(`[fetchSamamActivities] Local loopback failed for ${endpoint}:`, err.message);
    try {
      // Fallback to public IP
      return await tryHost('103.206.105.67', 443, 'sacactivities.kluniversity.in');
    } catch (err2: any) {
      console.error(`[fetchSamamActivities] Public IP failed for ${endpoint}:`, err2.message);
      throw err2;
    }
  }
}
