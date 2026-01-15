import { CommandHandler, CommandContext } from "./types"
import * as fileSystemCommands from "./filesystem"
import * as fileContentCommands from "./file-content"
import * as systemCommands from "./system"
import * as networkCommands from "./network"
import * as gameCommands from "./game"
import * as toolCommands from "./tools"
import * as easterEggs from "./easter-eggs"
import * as snakeCommand from "../gameplay/snake"

const commands: Record<string, CommandHandler> = {
    // Filesystem
    cd: fileSystemCommands.cd,
    ls: fileSystemCommands.ls,
    mkdir: fileSystemCommands.mkdir,
    touch: fileSystemCommands.touch,
    rm: fileSystemCommands.rm,
    cp: fileSystemCommands.cp,
    mv: fileSystemCommands.mv,
    chmod: fileSystemCommands.chmod,
    pwd: fileSystemCommands.pwd,

    // Content
    cat: fileContentCommands.cat,
    grep: fileContentCommands.grep,
    echo: fileContentCommands.echo,
    strings: fileContentCommands.strings,

    // System
    ping: systemCommands.ping,
    whoami: systemCommands.whoami,
    env: systemCommands.env,
    printenv: systemCommands.env, // alias
    ssh: systemCommands.ssh,
    exit: systemCommands.exit,
    sudo: systemCommands.sudo,
    reboot: systemCommands.reboot,
    nslookup: systemCommands.nslookup,
    ps: systemCommands.ps,
    lsmod: systemCommands.lsmod,
    docker: systemCommands.docker,

    // Network
    curl: networkCommands.curl,
    netstat: networkCommands.netstat,
    tcpdump: networkCommands.tcpdump,

    // Tools
    base64: toolCommands.base64,
    openssl: toolCommands.openssl,
    unzip: toolCommands.unzip,
    hexdump: toolCommands.hexdump,
    admin_login: toolCommands.adminLogin,
    './admin_login': toolCommands.adminLogin,
    './overflow_test': toolCommands.overflowTest,
    './vuln_server': toolCommands.vulnServer,
    john: toolCommands.john,
    stegsolve: toolCommands.stegsolve,
    decrypt: toolCommands.decrypt,

    // Game
    help: gameCommands.help,
    clear: gameCommands.clear,
    guide: gameCommands.guide,
    tasks: gameCommands.guide, // alias
    status: gameCommands.status,
    submit: gameCommands.submit,

    // Easter Eggs
    vi: easterEggs.vi,
    vim: easterEggs.vi,
    nano: easterEggs.vi,
    matrix: easterEggs.matrix,
    answer: easterEggs.answer,
    '42': easterEggs.answer,
    brew: easterEggs.teapot,
    coffee: easterEggs.teapot,
    tea: easterEggs.teapot,
    
    // Mini Games
    snake: snakeCommand.snake,
}

export const executeCommand = async (command: string, args: string[], context: CommandContext) => {
    const handler = commands[command];
    if (handler) {
        // Reset command not found count on successful command execution
        context.setCommandNotFoundCount(0);
        await handler(args, context);
    } else {
        context.addToHistory('output', `Command not found: ${command}`);
        context.setCommandNotFoundCount(prev => prev + 1);
    }
}
