package com.darksoft.buildquest.star;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import androidx.core.content.FileProvider;
import java.io.File;

public class STAT {
    private static final String TAG = "STAT";

    public static void startReferShare(Activity activity, String pkgName, String platform, String desc, String type, String imgPath, String videoUrl) {
        if (activity == null) {
            Log.e(TAG, "Invalid parameters");
            return;
        }

        try {
            if ("video".equals(type)) {
                shareVideo(activity, pkgName, platform, desc, videoUrl);
            } else if ("img_and_txt".equals(type)) {
                shareImageAndText(activity, pkgName, platform, desc, imgPath);
            }
        } catch (Exception e) {
            Log.e(TAG, "Share failed", e);
        }
    }

    private static void shareImageAndText(Activity activity, String pkgName, String platform,
                                          String desc, String imgPath) {
        Intent intent = new Intent();
        Uri imageUri = null;
        Log.e(TAG, "shareImageAndText imgPath: " + imgPath);
        if (imgPath != null && !imgPath.isEmpty() && new File(imgPath).exists()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                imageUri = FileProvider.getUriForFile(
                        activity,
                        activity.getPackageName() + ".fileprovider",
                        new File(imgPath)
                );
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                imageUri = Uri.fromFile(new File(imgPath));
            }

            intent.setAction(Intent.ACTION_SEND);
            intent.setType("image/*");
            intent.putExtra(Intent.EXTRA_STREAM, imageUri);
            if (desc != null && !desc.isEmpty()) {
                intent.putExtra(Intent.EXTRA_TEXT, desc);
            }
        } else {
            intent.setAction(Intent.ACTION_SEND);
            intent.setType("text/plain");
            intent.putExtra(Intent.EXTRA_TEXT, desc);
        }

        if ("sys".equals(pkgName)) {
            Intent chooserIntent = Intent.createChooser(intent, "Share");
            chooserIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            // 确保系统分享器有权限
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                // 授予系统分享器权限
                activity.grantUriPermission(
                        "android",  // 系统分享器的包名
                        imageUri,
                        Intent.FLAG_GRANT_READ_URI_PERMISSION
                );
            }
            activity.startActivity(chooserIntent);
            return;
        }

        shareToSpecificApp(activity, intent, pkgName);
    }

    private static void shareVideo(Activity activity, String pkgName, String platform,
                                   String desc, String videoUrl) {
        Log.w(TAG, "videoUrl: " + videoUrl);
        if (videoUrl == null || videoUrl.isEmpty()) {
            Log.e(TAG, "Video path or URL is empty");
            return;
        }

        Uri videoUri;
        File videoFile = new File(videoUrl);
        if (!videoFile.exists()) {
            Log.e(TAG, "Video file not found: " + videoUrl);
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            videoUri = FileProvider.getUriForFile(
                    activity,
                    activity.getPackageName() + ".fileprovider",
                    videoFile
            );
        } else {
            videoUri = Uri.fromFile(videoFile);
        }

        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("video/*");
        intent.putExtra(Intent.EXTRA_STREAM, videoUri);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }

        if (desc != null && !desc.isEmpty()) {
            intent.putExtra(Intent.EXTRA_TEXT, desc);
        }

        shareToSpecificApp(activity, intent, pkgName);
    }

    private static void shareToSpecificApp(Activity activity, Intent intent, String pkgName) {
        if (pkgName == null || pkgName.isEmpty()) {
            activity.startActivity(Intent.createChooser(intent, "分享到"));
            return;
        }

        if (!isAppInstalled(activity, pkgName)) {
            Log.w(TAG, "App not installed: " + pkgName);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(Intent.createChooser(intent, "分享到"));
            return;
        }

        intent.setPackage(pkgName);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        try {
            activity.startActivity(intent);
        } catch (Exception e) {
            Log.e(TAG, "Start share intent failed", e);
            intent.setPackage(null);
            activity.startActivity(Intent.createChooser(intent, "分享到"));
        }
    }

    private static boolean isAppInstalled(Activity activity, String packageName) {
        try {
            activity.getPackageManager().getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }
}
