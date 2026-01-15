export type FileType = 'folder' | 'text' | 'image' | 'app';

export interface FileSystemNode {
  id: string;
  name: string;
  type: FileType;
  content?: string; // For text files
  src?: string; // For images
  children?: FileSystemNode[]; // For folders
  icon?: string; // Custom icon name
  appId?: string; // For executable apps
}

// Helper to create common system folders
const createSystemFolder = (id: string, name: string, children: FileSystemNode[] = []): FileSystemNode => ({
  id,
  name,
  type: 'folder',
  children
});

// The actual C: Drive content
const cDrive: FileSystemNode = {
  id: 'c_drive',
  name: 'C:',
  type: 'folder',
  children: [
    {
      id: 'windows',
      name: 'WINDOWS',
      type: 'folder',
      children: [
        {
          id: 'system32',
          name: 'SYSTEM32',
          type: 'folder',
          children: [
            { id: 'kernel32', name: 'kernel32.dll', type: 'text', content: 'Binary content...' },
            { id: 'user32', name: 'user32.dll', type: 'text', content: 'Binary content...' },
            { id: 'gdi32', name: 'gdi32.dll', type: 'text', content: 'Binary content...' },
            { id: 'shell32', name: 'shell32.dll', type: 'text', content: 'Binary content...' },
          ]
        },
        {
          id: 'fonts',
          name: 'FONTS',
          type: 'folder',
          children: [
            { id: 'arial', name: 'Arial.ttf', type: 'text', content: '(TrueType Font File)' },
            { id: 'times', name: 'Times.ttf', type: 'text', content: '(TrueType Font File)' },
            { id: 'courier', name: 'Courier.ttf', type: 'text', content: '(TrueType Font File)' },
          ]
        },
        { id: 'win_ini', name: 'WIN.INI', type: 'text', content: '[windows]\nload=\nrun=\nNullPort=None\ndevice=HP LaserJet 4,HPPCL5MS,LPT1:' },
        { id: 'system_ini', name: 'SYSTEM.INI', type: 'text', content: '[boot]\nshell=Explorer.exe\nsystem.drv=system.drv\ndrivers=mmsystem.dll' },
        { id: 'notepad_exe', name: 'NOTEPAD.EXE', type: 'app', appId: 'notepad', icon: 'file-text' },
        { id: 'explorer_exe', name: 'EXPLORER.EXE', type: 'app', appId: 'explorer', icon: 'folder' },
      ]
    },
    {
      id: 'program_files',
      name: 'Program Files',
      type: 'folder',
      children: [
        {
          id: 'smart_read',
          name: 'SmartRead',
          type: 'folder',
          children: [
            { id: 'readme_sr', name: 'README.TXT', type: 'text', content: 'SmartRead System v1.0\n\nAccess restricted to authorized personnel only.' },
            { id: 'uninstall', name: 'UNINSTALL.EXE', type: 'app', appId: 'doom', icon: 'gamepad' }, // Easter egg: Uninstall triggers Doom
          ]
        },
        {
          id: 'games_dir',
          name: 'Games',
          type: 'folder',
          children: [
             { id: 'doom_exe_real', name: 'Doom.exe', type: 'app', appId: 'doom', icon: 'gamepad' },
             { id: 'minesweeper_exe_real', name: 'WinMine.exe', type: 'app', appId: 'minesweeper', icon: 'gamepad' }
          ]
        }
      ]
    },
    {
      id: 'documents',
      name: 'My Documents',
      type: 'folder',
      children: [
        { id: 'todo', name: 'TODO.TXT', type: 'text', content: '1. Fix Y2K bugs\n2. Buy more floppy disks\n3. Delete evidence' },
        { id: 'secret_plans', name: 'Secret_Plans.doc', type: 'text', content: 'Project: OVERWRITE\n\nObjective: Replace reality with fiction.\nStatus: 45% Complete' }
      ]
    },
    { id: 'autoexec', name: 'AUTOEXEC.BAT', type: 'text', content: '@ECHO OFF\nPROMPT $p$g\nPATH C:\\WINDOWS;C:\\WINDOWS\\COMMAND' },
    { id: 'config', name: 'CONFIG.SYS', type: 'text', content: 'DEVICE=C:\\WINDOWS\\HIMEM.SYS\nDOS=HIGH,UMB\nFILES=40' },
  ]
};

// Desktop Content
const desktop: FileSystemNode = {
  id: 'desktop',
  name: 'Desktop',
  type: 'folder',
  children: [
    {
      id: 'my_computer',
      name: 'My Computer',
      type: 'app', 
      appId: 'explorer',
      icon: 'computer'
    },
    {
      id: 'recycle_bin',
      name: 'Recycle Bin',
      type: 'folder',
      icon: 'recycle-bin',
      children: [
        { id: 'deleted_1', name: 'virus.exe', type: 'text', content: 'Not actually a virus.' },
        { id: 'deleted_2', name: 'love_letter.txt', type: 'text', content: 'I love you... I love you not...' }
      ]
    },
    {
      id: 'deleted_manuscripts',
      name: '已删除原稿',
      type: 'folder',
      children: [
        {
          id: 'chapter_99_draft',
          name: 'Chapter_99_Draft.txt',
          type: 'text',
          content: 'SYSTEM LOG: This chapter was deleted by [ADMIN] on 2024-02-14.\n\n"The protagonist realized that the world was just a simulation running on a retro OS..."'
        },
        {
          id: 'rejected_plot',
          name: 'Rejected_Plot.txt',
          type: 'text',
          content: 'Plot Idea #404: The characters become self-aware and try to escape the novel platform via the API.'
        }
      ]
    },
    {
      id: 'banned_users',
      name: '被封禁的用户档案',
      type: 'folder',
      children: [
        {
          id: 'user_x',
          name: 'User_X.log',
          type: 'text',
          content: 'User X was banned for attempting to inject SQL code into the comments section. Last known IP: 192.168.0.666'
        }
      ]
    },
    {
      id: 'system_backdoor',
      name: '系统后门',
      type: 'folder',
      children: [
        {
          id: 'readme',
          name: 'READ_ME_FIRST.txt',
          type: 'text',
          content: 'WARNING: Unauthorized access is a federal crime.\n\n(Just kidding, find the flag.)'
        },
        {
          id: 'secret_flag',
          name: 'flag.txt',
          type: 'text',
          content: 'flag{retro_os_master_8822}'
        },
        {
          id: 'old_flag',
          name: 'legacy_flag.txt',
          type: 'text',
          content: 'flag{robots_keep_secrets_safe_4455}'
        }
      ]
    },
    {
      id: 'games_shortcut_folder',
      name: 'Games',
      type: 'folder',
      children: [
        {
          id: 'doom_shortcut',
          name: 'Doom',
          type: 'app',
          appId: 'doom',
          icon: 'gamepad'
        },
        {
          id: 'minesweeper_shortcut',
          name: 'Minesweeper',
          type: 'app',
          appId: 'minesweeper',
          icon: 'gamepad'
        }
      ]
    }
  ]
};

export const initialFileSystem: FileSystemNode[] = [
  {
    id: 'root',
    name: 'My Computer',
    type: 'folder',
    children: [
      desktop,
      cDrive,
      {
        id: 'd_drive',
        name: 'D: (Data)',
        type: 'folder',
        children: [
          { id: 'backup', name: 'Backup.zip', type: 'text', content: '(Binary Data)' },
          { id: 'music', name: 'Music', type: 'folder', children: [] }
        ]
      }
    ]
  }
];
