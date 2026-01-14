import { CommandHandler, normalizePath, findNode, hasPermission, canDelete } from "./types"

export const cd: CommandHandler = (args, { fileSystem, currentPath, setCurrentPath, currentUser, addToHistory }) => {
    if (args.length === 0) {
        setCurrentPath('/home/ctf');
    } else {
        const newPath = normalizePath(args[0], currentPath);
        const targetNode = findNode(fileSystem, newPath);
        
        if (!targetNode) {
            addToHistory('output', `cd: ${args[0]}: No such file or directory`);
        } else if (targetNode.type !== 'directory') {
            addToHistory('output', `cd: ${args[0]}: Not a directory`);
        } else {
            if (hasPermission(targetNode, currentUser, 'execute')) {
                setCurrentPath(newPath);
            } else {
                addToHistory('output', `cd: ${args[0]}: Permission denied`);
            }
        }
    }
}

export const ls: CommandHandler = (args, { fileSystem, currentPath, currentUser, addToHistory }) => {
    const targetPath = args.length > 0 && !args[0].startsWith('-') 
        ? normalizePath(args[0], currentPath) 
        : currentPath;
        
    const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
    
    const node = findNode(fileSystem, targetPath);
    
    if (!node) {
        addToHistory('output', `ls: cannot access '${args[0] || ''}': No such file or directory`);
    } else if (node.type === 'file') {
        addToHistory('output', args[0] || node.content); // Simplified
    } else {
        // Check read permission for directory
        if (hasPermission(node, currentUser, 'read')) {
            const children = Object.entries(node.children)
                .filter(([name]) => showHidden || !name.startsWith('.'))
                .sort(([a], [b]) => a.localeCompare(b));
                
            if (longFormat) {
                addToHistory('output', `total ${children.length}`);
                children.forEach(([name, child]) => {
                    const typeChar = child.type === 'directory' ? 'd' : '-';
                    const size = child.type === 'file' ? (child.size || 0) : 4096;
                    // Mock date
                    const date = 'Jan 14 10:00';
                    addToHistory('output', `${typeChar}${child.permissions} 1 ${child.owner} ${child.group} ${size} ${date} ${name}`);
                });
            } else {
                addToHistory('output', children.map(([name]) => name).join('  '));
            }
        } else {
            addToHistory('output', `ls: cannot open directory '${targetPath}': Permission denied`);
        }
    }
}

export const pwd: CommandHandler = (args, { currentPath, addToHistory }) => {
    addToHistory('output', currentPath);
    addToHistory('output', "[Beginner] Location confirmed. Flag: flag{location_confirmed_home}");
}

export const mkdir: CommandHandler = (args, { fileSystem, setFileSystem, currentPath, currentUser, addToHistory }) => {
    if (args.length === 0) {
        addToHistory('output', "usage: mkdir <directory>");
    } else {
        const dirName = args[0];
        const fullPath = normalizePath(dirName, currentPath);
        const parentPath = fullPath.substring(0, fullPath.lastIndexOf('/')) || '/';
        const name = fullPath.substring(fullPath.lastIndexOf('/') + 1);
        
        const parentNode = findNode(fileSystem, parentPath);
        if (parentNode && parentNode.type === 'directory') {
            if (hasPermission(parentNode, currentUser, 'write')) {
                if (parentNode.children[name]) {
                    addToHistory('output', `mkdir: cannot create directory '${dirName}': File exists`);
                } else {
                    parentNode.children[name] = {
                        type: 'directory',
                        children: {},
                        permissions: 'rwxr-xr-x',
                        owner: currentUser,
                        group: currentUser
                    };
                    setFileSystem({...fileSystem}); // Trigger re-render
                    addToHistory('output', "[Beginner] Directory created! Flag: flag{mkdir_creator_2233}");
                }
            } else {
                addToHistory('output', `mkdir: cannot create directory '${dirName}': Permission denied`);
            }
        } else {
             addToHistory('output', `mkdir: cannot create directory '${dirName}': No such file or directory`);
        }
    }
}

export const touch: CommandHandler = (args, { fileSystem, setFileSystem, currentPath, currentUser, addToHistory }) => {
    if (args.length === 0) {
        addToHistory('output', "usage: touch <file>");
    } else {
        const fileName = args[0];
        const fullPath = normalizePath(fileName, currentPath);
        const parentPath = fullPath.substring(0, fullPath.lastIndexOf('/')) || '/';
        const name = fullPath.substring(fullPath.lastIndexOf('/') + 1);
        
        const parentNode = findNode(fileSystem, parentPath);
        if (parentNode && parentNode.type === 'directory') {
            if (hasPermission(parentNode, currentUser, 'write')) {
                if (!parentNode.children[name]) {
                    parentNode.children[name] = {
                        type: 'file',
                        content: '',
                        permissions: 'rw-r--r--',
                        owner: currentUser,
                        group: currentUser,
                        size: 0
                    };
                    setFileSystem({...fileSystem});
                    addToHistory('output', "[Beginner] File created! Flag: flag{touch_artist_4455}");
                }
                // If exists, update timestamp (not implemented)
            } else {
                addToHistory('output', `touch: cannot touch '${fileName}': Permission denied`);
            }
        } else {
             addToHistory('output', `touch: cannot touch '${fileName}': No such file or directory`);
        }
    }
}

export const rm: CommandHandler = (args, { fileSystem, setFileSystem, currentPath, currentUser, addToHistory }) => {
    if (args.includes('-rf') && args.includes('/')) {
        addToHistory('output', "rm: it is dangerous to operate recursively on /")
        addToHistory('output', "flag{dont_try_this_at_home_rm_rf}")
    } else if (args.length > 0) {
        const target = args.filter(a => !a.startsWith('-'))[0];
        if (!target) {
            addToHistory('output', "rm: missing operand");
            return;
        }
        const fullPath = normalizePath(target, currentPath);
        const parentPath = fullPath.substring(0, fullPath.lastIndexOf('/')) || '/';
        const name = fullPath.substring(fullPath.lastIndexOf('/') + 1);
        
        const parentNode = findNode(fileSystem, parentPath);
        if (parentNode && parentNode.type === 'directory') {
            if (canDelete(parentNode, name, currentUser)) {
                if (parentNode.children[name]) {
                    delete parentNode.children[name];
                    setFileSystem({...fileSystem});
                    addToHistory('output', "[Beginner] File removed! Flag: flag{rm_cleaner_6677}");
                } else {
                    addToHistory('output', `rm: cannot remove '${target}': No such file or directory`);
                }
            } else {
                addToHistory('output', `rm: cannot remove '${target}': Permission denied`);
            }
        }
    } else {
        addToHistory('output', "rm: missing operand");
    }
}

export const cp: CommandHandler = (args, { fileSystem, setFileSystem, currentPath, currentUser, addToHistory }) => {
    if (args.length < 2) {
       addToHistory('output', "usage: cp [-r] <source> <dest>")
    } else {
       const isRecursive = args.includes('-r')
       const cleanArgs = args.filter(a => a !== '-r')
       if (cleanArgs.length < 2) {
            addToHistory('output', "usage: cp [-r] <source> <dest>")
       } else {
           const srcName = cleanArgs[0]
           const destName = cleanArgs[1]
           
           const srcPath = normalizePath(srcName, currentPath)
           const srcNode = findNode(fileSystem, srcPath)
           
           if (!srcNode) {
               addToHistory('output', `cp: cannot stat '${srcName}': No such file or directory`)
           } else if (srcNode.type === 'directory' && !isRecursive) {
               addToHistory('output', `cp: -r not specified; omitting directory '${srcName}'`)
           } else {
               const destFullPath = normalizePath(destName, currentPath)
               let destParentPath = destFullPath.substring(0, destFullPath.lastIndexOf('/')) || '/'
               let destFileName = destFullPath.substring(destFullPath.lastIndexOf('/') + 1)
               
               // Check if dest is an existing directory
               const potentialDestDir = findNode(fileSystem, destFullPath)
               if (potentialDestDir && potentialDestDir.type === 'directory') {
                   destParentPath = destFullPath
                   destFileName = srcPath.substring(srcPath.lastIndexOf('/') + 1)
               }
               
               const destParentNode = findNode(fileSystem, destParentPath)
               if (destParentNode && destParentNode.type === 'directory') {
                    if (hasPermission(destParentNode, currentUser, 'write')) {
                        // Deep copy srcNode
                        const copyNode = JSON.parse(JSON.stringify(srcNode))
                        
                        destParentNode.children[destFileName] = copyNode
                        setFileSystem({...fileSystem})
                        addToHistory('output', "[Beginner] File copied! Flag: flag{cp_duplicator_8899}");
                    } else {
                        addToHistory('output', `cp: cannot create regular file '${destName}': Permission denied`)
                    }
               } else {
                    addToHistory('output', `cp: cannot create regular file '${destName}': No such file or directory`)
               }
           }
       }
    }
}

export const mv: CommandHandler = (args, { fileSystem, setFileSystem, currentPath, currentUser, addToHistory }) => {
    if (args.length < 2) {
       addToHistory('output', "usage: mv <source> <dest>")
    } else {
       const srcName = args[0]
       const destName = args[1]
       
       const srcPath = normalizePath(srcName, currentPath)
       const srcNode = findNode(fileSystem, srcPath)
       
       if (!srcNode) {
           addToHistory('output', `mv: cannot stat '${srcName}': No such file or directory`)
       } else {
           const srcParentPath = srcPath.substring(0, srcPath.lastIndexOf('/')) || '/'
           const srcFileName = srcPath.substring(srcPath.lastIndexOf('/') + 1)
           const srcParentNode = findNode(fileSystem, srcParentPath)

           if (srcParentNode && srcParentNode.type === 'directory') {
               if (!canDelete(srcParentNode, srcFileName, currentUser)) {
                   addToHistory('output', `mv: cannot move '${srcName}': Permission denied`)
               } else {
                   const destFullPath = normalizePath(destName, currentPath)
                   let destParentPath = destFullPath.substring(0, destFullPath.lastIndexOf('/')) || '/'
                   let destFileName = destFullPath.substring(destFullPath.lastIndexOf('/') + 1)
                   
                   // Check if dest is directory
                   const potentialDestDir = findNode(fileSystem, destFullPath)
                   if (potentialDestDir && potentialDestDir.type === 'directory') {
                       destParentPath = destFullPath
                       destFileName = srcFileName
                   }
                   
                   const destParentNode = findNode(fileSystem, destParentPath)
                   if (destParentNode && destParentNode.type === 'directory') {
                       if (hasPermission(destParentNode, currentUser, 'write')) {
                           // Move: Link to new, delete from old
                           destParentNode.children[destFileName] = srcNode 
                           delete srcParentNode.children[srcFileName]
                           setFileSystem({...fileSystem})
                           addToHistory('output', "[Beginner] File moved! Flag: flag{mv_shifter_0011}");
                       } else {
                            addToHistory('output', `mv: cannot move to '${destName}': Permission denied`)
                       }
                   } else {
                       addToHistory('output', `mv: cannot move '${srcName}': No such file or directory`)
                   }
               }
           }
       }
    }
}

export const chmod: CommandHandler = (args, { fileSystem, setFileSystem, currentPath, currentUser, addToHistory }) => {
    if (args.length < 2) {
       addToHistory('output', "Usage: chmod <mode> <file>")
    } else {
        const mode = args[0];
        const fileName = args[1];
        const fullPath = normalizePath(fileName, currentPath);
        const node = findNode(fileSystem, fullPath);
        
        if (!node) {
            addToHistory('output', `chmod: cannot access '${fileName}': No such file or directory`);
        } else {
            if (currentUser === 'root' || node.owner === currentUser) {
                let newPerms = node.permissions;
                if (mode === '+x') {
                    // Add x to all
                    // Permissions string is 9 chars: rwxrwxrwx
                    // offsets: 2, 5, 8 are execute bits
                    const chars = newPerms.split('');
                    if (chars[2] === '-') chars[2] = 'x';
                    if (chars[5] === '-') chars[5] = 'x';
                    if (chars[8] === '-') chars[8] = 'x';
                    newPerms = chars.join('');
                } else if (mode === '-x') {
                    newPerms = newPerms.replace(/x/g, '-');
                } else if (mode.match(/^[0-7]{3}$/)) {
                    // Simple octal to string
                    const map = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
                    newPerms = map[parseInt(mode[0])] + map[parseInt(mode[1])] + map[parseInt(mode[2])];
                }
                
                node.permissions = newPerms;
                setFileSystem({...fileSystem});
                
                if (fileName === 'backdoor.sh' && mode === '+x') {
                     // Check if backdoor.sh is now executable
                     addToHistory('output', "flag{chmod_777_script_execution}");
                }
            } else {
                addToHistory('output', `chmod: changing permissions of '${fileName}': Operation not permitted`);
            }
        }
    }
}
