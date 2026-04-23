package com.innoghte

import android.app.Application
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.modules.i18nmanager.I18nUtil

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    // Default app language: Persian (Iran), RTL-friendly.
    AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags("fa-IR"))
    val i18n = I18nUtil.instance
    i18n.allowRTL(applicationContext, true)
    i18n.forceRTL(applicationContext, true)
    loadReactNative(this)
  }
}
