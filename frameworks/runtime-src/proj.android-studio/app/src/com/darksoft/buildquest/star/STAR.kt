package com.darksoft.buildquest.star

import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.WindowManager
import androidx.annotation.Keep
import com.adjust.sdk.Adjust
import com.adjust.sdk.AdjustConfig
import org.cocos2dx.lib.Cocos2dxActivity
import org.cocos2dx.lib.Cocos2dxGLSurfaceView
import org.cocos2dx.lib.Cocos2dxHelper

@Keep
class STAR : Cocos2dxActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        if (!isTaskRoot) {
            return
        }

        initAdjust()
    }

    override fun onCreateView(): Cocos2dxGLSurfaceView {
        val glSurfaceView = Cocos2dxGLSurfaceView(this)
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8)

        return glSurfaceView
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.VANILLA_ICE_CREAM) {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (!isTaskRoot) {
            return
        }
    }

    companion object {
        val n: Array<String> = Array(3) {""}

        private fun initAdjust() {
            val adjustToken = getContext().getString(R.string.adjust_token)
            val adjustConfig = AdjustConfig(getContext(), adjustToken, AdjustConfig.ENVIRONMENT_PRODUCTION)
            Adjust.initSdk(adjustConfig)

            Adjust.getGoogleAdId(getContext()) { googleAdId ->
                n[0] = googleAdId ?: ""
            }

            Adjust.getAdid { adid ->
                n[1] = adid ?: ""
            }

            Adjust.getAttribution { attribution ->
                n[2] = attribution?.network ?: ""
            }
        }

        // ---------------------------- JSB 交互 ------------------------------

        @JvmStatic
        @Keep
        fun STARV(): String {
            var name = ""
            var code = ""
            try {
                val info = getContext().packageManager.getPackageInfo(getContext().packageName, 0)
                name = info.versionName.toString()
                // 适配 Android P（API 28）及以上版本
                code = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    info.longVersionCode.toString() // 返回 long 类型
                } else {
                    info.versionCode.toString() // 返回 int 类型（已弃用）
                }
            } catch (e: PackageManager.NameNotFoundException) {
                e.printStackTrace()
            }

            return listOf(name, code).joinToString("_")
        }

        @JvmStatic
        @Keep
        fun STARN(): String {
            val data = STAS.Data(getContext())
            return listOf(n[0], n[1], n[2], data).joinToString("_")
        }

        @JvmStatic
        @Keep
        fun STARC(link: String) {
            Cocos2dxHelper.copyTextToClipboard(link);
        }

        @JvmStatic
        @Keep
        fun STARS(pkgName: String, platform: String, desc: String, type: String, imgPath: String, videoUrl: String) {
            Cocos2dxHelper.getActivity().runOnUiThread {
                try {
                    STAT.startReferShare(Cocos2dxHelper.getActivity(), pkgName, platform, desc, type, imgPath, videoUrl)
//                    Log.d("Main", "Share started with pkgName: $pkgName, platform: $platform, desc: $desc, type: $type, ImgPath: $imgPath, videoUrl: $videoUrl")
                }
                catch (e: Exception) {
//                    Log.e("Main", "Share failed", e)
                }
            }
        }
    }
}