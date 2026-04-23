#import <React/RCTI18nUtil.h>

void InnoghteConfigureRTL(void) {
  [[RCTI18nUtil sharedInstance] allowRTL:YES];
  [[RCTI18nUtil sharedInstance] forceRTL:YES];
}
