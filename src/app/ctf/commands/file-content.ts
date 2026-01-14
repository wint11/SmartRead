import { CommandHandler, normalizePath, findNode, hasPermission, resolveFileContent } from "./types"

export const cat: CommandHandler = async (args, { fileSystem, currentPath, currentUser, addToHistory }) => {
    if (args.length === 0) {
        addToHistory('output', "usage: cat <file>");
    } else {
        const catPath = normalizePath(args[0], currentPath);
        const catNode = findNode(fileSystem, catPath);
        
        if (!catNode) {
            addToHistory('output', `cat: ${args[0]}: No such file or directory`);
        } else if (catNode.type === 'directory') {
            addToHistory('output', `cat: ${args[0]}: Is a directory`);
        } else {
            if (hasPermission(catNode, currentUser, 'read')) {
                const content = await resolveFileContent(catNode);
                addToHistory('output', content);
            } else {
                addToHistory('output', `cat: ${args[0]}: Permission denied`);
            }
        }
    }
}

export const grep: CommandHandler = async (args, { fileSystem, currentPath, currentUser, addToHistory }) => {
    if (args.length < 2) {
       addToHistory('output', "Usage: grep <pattern> <file>")
    } else {
       const pattern = args[0]
       const fileName = args[1]
       const node = findNode(fileSystem, normalizePath(fileName, currentPath));
       
       if (node && node.type === 'file') {
          const content = await resolveFileContent(node);
          const lines = content.split('\n')
          const matches = lines.filter(line => line.includes(pattern))
          if (matches.length > 0) {
             matches.forEach(m => addToHistory('output', m))
          }
       } else {
          addToHistory('output', `grep: ${fileName}: No such file or directory`)
       }
    }
}

export const echo: CommandHandler = (args, { addToHistory }) => {
    if (args.length > 0) {
       addToHistory('output', args.join(' '))
       addToHistory('output', "[Beginner] Echo works! Flag: flag{echo_echo_echo_111}")
    } else {
       addToHistory('output', "")
    }
}

export const strings: CommandHandler = async (args, { fileSystem, currentPath, addToHistory }) => {
    if (args.length < 1) {
        addToHistory('output', "Usage: strings <file>");
    } else {
        const fileName = args[0];
        const node = findNode(fileSystem, normalizePath(fileName, currentPath));
        if (node && node.type === 'file') {
            const content = await resolveFileContent(node);
            const matches = content.match(/[ -~]{4,}/g);
            if (matches) {
                matches.forEach(m => addToHistory('output', m));
            }
        } else {
            addToHistory('output', `strings: ${fileName}: No such file or directory`);
        }
    }
}
