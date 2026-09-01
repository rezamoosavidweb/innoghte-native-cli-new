package com.innoghte

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.text.TextUtils
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class VideoPlayerModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = NAME

  @ReactMethod
  fun open(url: String, promise: Promise) {
    try {
      val html = """
        <html>
          <head>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <style>
              html,body{margin:0;background:#000;width:100%;height:100%}
              video{width:100%;height:100%;object-fit:contain}
            </style>
          </head>
          <body>
            <video controls playsinline>
              <source src="${TextUtils.htmlEncode(url)}" type="video/mp4" />
            </video>
          </body>
        </html>
      """.trimIndent()
      val browserUri = Uri.parse("data:text/html,${Uri.encode(html)}")
      val chromeIntent = Intent(Intent.ACTION_VIEW, browserUri).apply {
        setClassName("com.android.chrome", "com.google.android.apps.chrome.IntentDispatcher")
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }

      try {
        reactApplicationContext.startActivity(chromeIntent)
      } catch (_: ActivityNotFoundException) {
        val playerIntent = Intent(Intent.ACTION_VIEW).apply {
          setDataAndType(Uri.parse(url), "video/mp4")
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        reactApplicationContext.startActivity(playerIntent)
      }
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("E_VIDEO_PLAYER", "Could not open the video player", error)
    }
  }

  companion object {
    const val NAME = "VideoPlayer"
  }
}
