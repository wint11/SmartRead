import { FLAGS } from './flags'

// This file contains the sensitive content that should NOT be in the client bundle.
// The keys correspond to the 'id' field in the FileSystemNode (which we will add).

export const SECURE_FILES: Record<string, string> = {
  'firmware_bin': "\x7fELF... \x00\x00... s3cr3t_k3y_h1dd3n_h3r3 ... " + FLAGS[60] + " ... \x00\x00",
  
  'backup_zip_b64': "UEsDBAoAAAAAAKyZXVcAAAAAAAAAAAAAAAAMABwAc2VjcmV0X2tleS8KACAAAAAAAAEAGAAgAAAABwAAAFBLAwQKAAAAAACsmV1X0f8/tSAAAAAgAAAAFwAcAHNlY3JldF9rZXkvcHJpdmF0ZS5rZXkKACAAAAAAAAEAGAAgAAAABwAAAGZsYWd7emlwX2ZpbGVzX2FyZV9mdW5fOTk4OH0KUEsBAh4DCgAAAAAArJldVwAAAAAAAAAAAAAAAAwAGAAAAAAAAAAAAKSBAAAAAHNlY3JldF9rZXkvCgAgAAAAAAABABgAIAAAAAcAAABQSwECHgMKAAAAAACsmV1XR/z+1IAAAAAgAAAAFwAYAAAAAAAAAAAApIFMAAAAc2VjcmV0X2tleS9wcml2YXRlLmtleQoAIAAAAAAAAQAYACAAAAAHAAAAUEsFBgAAAAACAAIAaQAAAG0AAAAAAA==",
  
  'access_log': `[2024-01-14 09:55:01] GET /index.html 200 - Mozilla/5.0
[2024-01-14 09:55:05] GET /style.css 200 - Mozilla/5.0
[2024-01-14 09:56:10] POST /login 401 - Auth Failed
[2024-01-14 09:56:12] POST /login 401 - Auth Failed
[2024-01-14 09:56:15] POST /login 500 - System Error: Suspicious Activity Detected
[2024-01-14 09:57:00] GET /about 200 - Mozilla/5.0
[2024-01-14 09:58:22] GET /dashboard 403 - Access Denied
[2024-01-14 09:59:01] POST /api/v1/user 500 - System Error: flag{grep_is_your_friend_5522}
[2024-01-14 10:00:20] GET /search?q=test 200 - Chrome/90
[2024-01-14 10:01:45] DELETE /db/users 500 - System Error: DB Connection Failed
[2024-01-14 10:02:00] GET /logout 200 - Mozilla/5.0`,
  
  'memory_dmp': "00000000  7f 45 4c 46 02 01 01 00  00 00 00 00 00 00 00 00  |.ELF............|\n00000010  02 00 3e 00 01 00 00 00  00 00 00 00 00 00 00 00  |..>.............|\n... strings ... \npassword=admin\nsecret=123456\nflag{memory_dump_password_plain}\n...",

  'legacy_script_js': "eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c])}}return p}('0.1(\"2{3}\")',4,4,'console|log|flag|reverse_engineering_obfuscated_js_9922'.split('|'),0,{}))",

  'strange_code_txt': "Intercepted Message:\nSynt: synt{ebg13_vf_gbb_rnfl_5566}",

  'token_gen': "ELF 64-bit LSB executable... \nstrings: flag{binary_strings_hardcoded_key}",

  'bash_history': "rm -rf /tmp/*\n./backdoor.sh\ncat /etc/shadow\n# " + FLAGS[304],

  'sudo_flag': FLAGS[18],
  'sudo_incident': FLAGS[49],
  
  'id_rsa_decrypted': '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEArw... (decrypted) ...\n-----END RSA PRIVATE KEY-----',
  'extracted_private_key': FLAGS[51],
}
