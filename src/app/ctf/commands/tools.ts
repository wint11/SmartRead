import { CommandHandler, normalizePath, findNode, resolveFileContent } from "./types"
import { getFileContent } from "../actions"

export const base64: CommandHandler = async (args, { fileSystem, currentPath, currentUser, addToHistory, setFileSystem }) => {
    if (args.includes('-d') && args.length >= 2) {
        const fileName = args[args.indexOf('-d') + 1]
        const node = findNode(fileSystem, normalizePath(fileName, currentPath));
        
        if (node && node.type === 'file') {
           try {
              const content = await resolveFileContent(node);
              const decoded = atob(content)
              // If it's the backup zip, we want to save it as a "file" in memory so unzip can see it
              if (fileName.includes('backup.zip.b64')) {
                  // Create backup.zip in the same directory
                  const fullPath = normalizePath(fileName, currentPath);
                  const parentPath = fullPath.substring(0, fullPath.lastIndexOf('/')) || '/';
                  const parentNode = findNode(fileSystem, parentPath);
                  if (parentNode && parentNode.type === 'directory') {
                      parentNode.children['backup.zip'] = {
                          type: 'file',
                          content: decoded,
                          permissions: 'rw-r--r--',
                          owner: currentUser,
                          group: currentUser
                      };
                      setFileSystem({...fileSystem});
                      addToHistory('output', "[System] Decoded data saved to 'backup.zip'")
                  }
              } else {
                  addToHistory('output', decoded)
              }
           } catch (e) {
              addToHistory('output', "base64: invalid input")
           }
        } else {
           addToHistory('output', `base64: ${fileName}: No such file or directory`)
        }
     } else if (args.length > 0 && !args[0].startsWith('-')) {
        addToHistory('output', btoa(args[0]))
     } else {
        addToHistory('output', "Usage: base64 -d <file> OR base64 <string>")
     }
}

export const hexdump: CommandHandler = (args, { fileSystem, currentPath, addToHistory }) => {
    if (args.length === 0) {
        addToHistory('output', "Usage: hexdump <file>")
    } else {
        const fileName = args[0]
        const node = findNode(fileSystem, normalizePath(fileName, currentPath));
        if (node && node.type === 'file') {
            const content = node.content;
            let hex = ''
            for (let i = 0; i < Math.min(content.length, 48); i++) {
                hex += content.charCodeAt(i).toString(16).padStart(2, '0') + ' '
            }
            addToHistory('output', hex)
            
            if (fileName === 'firmware.bin') {
                addToHistory('output', "\n[Analysis Complete] Hidden pattern found: flag{hex_dump_master_binary_analyst_5511}")
            }
        } else {
            addToHistory('output', `hexdump: ${fileName}: No such file or directory`)
        }
    }
}

export const adminLogin: CommandHandler = (args, { addToHistory, setActiveTool }) => {
    addToHistory('output', "SQL Injection Tool v1.0")
    addToHistory('output', "Enter username:")
    setActiveTool('admin_login')
}

export const overflowTest: CommandHandler = (args, { addToHistory, setActiveTool }) => {
    addToHistory('output', "Buffer Overflow Test Tool v0.1")
    addToHistory('output', "Enter data buffer:")
    setActiveTool('overflow_test')
}

export const vulnServer: CommandHandler = (args, { addToHistory }) => {
    addToHistory('output', "Starting Vulnerable Server v2.0...")
    addToHistory('output', "Listening on port 9999...")
    addToHistory('output', "[ALERT] Stack smashing detected!")
    addToHistory('output', "[ALERT] EIP overwritten with 0xdeadbeef")
    addToHistory('output', "Exploit successful! Flag: flag{buffer_overflow_return_to_libc}")
}

export const john: CommandHandler = (args, { addToHistory }) => {
    if (args.includes('shadow') || args.includes('/etc/shadow')) {
        addToHistory('output', "Loaded 1 password hash (sha512crypt, SHA512 [SHA512 128/128 AVX 512BW])")
        addToHistory('output', "Proceeding with single, rules:Wordlist")
        addToHistory('output', "Press 'q' or Ctrl-C to abort, almost any other key for status")
        addToHistory('output', "root:password123 (root)")
        addToHistory('output', "1g 0:00:00:00 DONE 2/3 (2025-01-14 10:00) 100.0g/s 300.0p/s 300.0c/s 300.0C/s")
        addToHistory('output', "")
        addToHistory('output', "flag{shadow_file_cracked_root_password}")
    } else {
        addToHistory('output', "john: usage: john <password-file>")
    }
}

export const stegsolve: CommandHandler = (args, { addToHistory }) => {
    if (args.length > 0) {
        addToHistory('output', "Analyzing image...")
        addToHistory('output', "LSB Extraction (Bit Plane 0):")
        addToHistory('output', "Found hidden text: flag{steganography_image_hidden_text}")
    } else {
        addToHistory('output', "usage: stegsolve <image-file>")
    }
}

export const decrypt: CommandHandler = (args, { addToHistory }) => {
    if (args.length >= 2) {
        // args[0] = file, args[1] = key
        addToHistory('output', "Applying XOR decryption with key " + args[1] + "...")
        addToHistory('output', "Decrypted output:")
        addToHistory('output', "flag{reverse_engineering_xor_cipher}")
    } else {
        addToHistory('output', "usage: decrypt <file> <hex-key>")
    }
}

export const openssl: CommandHandler = async (args, { fileSystem, currentPath, currentUser, addToHistory, setFileSystem }) => {
    if (args.includes('id_rsa.enc')) {
        addToHistory('output', "enter aes-256-cbc decryption password:")
        const kIndex = args.indexOf('-k')
        const pass = kIndex !== -1 ? args[kIndex+1] : null
        
        if (pass === 'smartread') {
            // Decrypt id_rsa
            const fullPath = normalizePath('id_rsa', currentPath);
            const parentPath = fullPath.substring(0, fullPath.lastIndexOf('/')) || '/';
            const parentNode = findNode(fileSystem, parentPath);
            if (parentNode && parentNode.type === 'directory') {
                 const decryptedContent = await getFileContent('id_rsa_decrypted');
                 parentNode.children['id_rsa'] = {
                     type: 'file',
                     content: decryptedContent,
                     permissions: 'rw-------',
                     owner: currentUser,
                     group: currentUser
                 };
                 setFileSystem({...fileSystem});
                 addToHistory('output', "writes to id_rsa")
                 addToHistory('output', "Decryption successful. Flag: flag{decrypt_ssl_private_key}")
            }
        } else {
             if (!pass) {
                 addToHistory('output', "error: password required (use -k <pass>)")
             } else {
                 addToHistory('output', "bad decrypt")
             }
        }
    } else {
        addToHistory('output', "openssl: only decryption of id_rsa.enc is supported in this simulation")
    }
}

export const unzip: CommandHandler = async (args, { fileSystem, currentPath, currentUser, addToHistory, setFileSystem }) => {
    if (args.length < 1) {
        addToHistory('output', "Usage: unzip <file>")
    } else {
        const fileName = args[0]
        const node = findNode(fileSystem, normalizePath(fileName, currentPath));
        
        if (node && node.type === 'file') {
            if (fileName === 'backup.zip' || fileName.endsWith('backup.zip')) {
                 // Check if it's the valid zip
                 addToHistory('output', 'Archive:  ' + fileName);
                 addToHistory('output', '   creating: secret_key/');
                 addToHistory('output', '  inflating: secret_key/private.key');
                 
                 // Create directory and file
                 const fullPath = normalizePath('secret_key', currentPath);
                 const parentPath = fullPath.substring(0, fullPath.lastIndexOf('/')) || '/';
                 const parentNode = findNode(fileSystem, parentPath);
                 
                 if (parentNode && parentNode.type === 'directory') {
                     const extractedContent = await getFileContent('extracted_private_key');
                     
                     parentNode.children['secret_key'] = {
                         type: 'directory',
                         children: {
                             'private.key': {
                                 type: 'file',
                                 content: extractedContent,
                                 permissions: 'rw-r--r--',
                                 owner: currentUser,
                                 group: currentUser
                             }
                         },
                         permissions: 'rwxr-xr-x',
                         owner: currentUser,
                         group: currentUser
                     };
                     setFileSystem({...fileSystem});
                 }
            } else {
                addToHistory('output', `unzip: cannot find or open ${fileName}, ${fileName}.zip or ${fileName}.ZIP.`)
            }
        } else {
            addToHistory('output', `unzip: cannot find or open ${fileName}, ${fileName}.zip or ${fileName}.ZIP.`)
        }
    }
}
