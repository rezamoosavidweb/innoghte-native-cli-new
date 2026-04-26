/**
 * Data provided by the shell (composition layer) to presentation
 * (drawer chrome, etc.) without domain imports inside `ui/`.
 */
export type ShellDrawerUserSnapshot = {
  isAuthenticated: boolean;
  displayName: string;
  emailLine: string;
  avatarInitials: string;
};

export type ShellDrawerUiModel = {
  onRequestLogout: () => void | Promise<void>;
  isDrawerOnPhysicalRight: boolean;
  user: ShellDrawerUserSnapshot;
};
