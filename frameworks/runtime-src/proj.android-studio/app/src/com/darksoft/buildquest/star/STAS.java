package com.darksoft.buildquest.star;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.provider.Settings;
import android.telephony.TelephonyManager;

public class STAS {
    private static final String TAG = "STAS";

    public static String Data(Context context) {
        TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        String networkOperator = telephonyManager.getNetworkOperator();
        String mcc = "";
        if (networkOperator != null && !networkOperator.isEmpty() && networkOperator.length() >= 3) {
            mcc = networkOperator.substring(0, 3);
        }

        String netMcc = telephonyManager.getNetworkCountryIso();
        String simMcc = telephonyManager.getSimCountryIso();

        String developMode = Data1(context);
        String vpnMode = Data2(context);

        String[] elements = {mcc, netMcc, simMcc, developMode, vpnMode};
        String result = String.join("_", elements);
        return result;
    }

    /**
     * DevelopMode 开发者模式 0-非开发模式 1-开发模式
     */
    private static String Data1(Context context) {
        boolean isDevelopOpen = false;
        // 检查开发者选项开关
        isDevelopOpen = Settings.Global.getInt(
                context.getContentResolver(),
                Settings.Global.DEVELOPMENT_SETTINGS_ENABLED,
                0
        ) == 1;

        boolean isAdbOpen = false;
        // 检查ADB调试开关
        isAdbOpen = Settings.Global.getInt(
                context.getContentResolver(),
                Settings.Global.ADB_ENABLED,
                0
        ) == 1;

        return (isDevelopOpen || isAdbOpen) ? "1" : "0";
    }

    /**
     * VpnMode 使用vpn 0-使用vpn 1-未使用vpn
     */
    private static String Data2(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

        boolean isVpnOpen = false;
        Network activeNetwork = connectivityManager.getActiveNetwork();
        if (activeNetwork != null) {
            NetworkCapabilities caps = connectivityManager.getNetworkCapabilities(activeNetwork);
            if (caps != null) {
                isVpnOpen = caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN);
            }
        }

        return isVpnOpen ? "0" : "1";
    }
}
