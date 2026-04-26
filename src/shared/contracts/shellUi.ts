/**
 * Data provided by the shell (composition layer) to presentation
 * (drawer chrome, etc.) without domain imports inside `ui/`.
 */
export type ShellDrawerUiModel = {
  onRequestLogout: () => void | Promise<void>;
  isDrawerOnPhysicalRight: boolean;
};
