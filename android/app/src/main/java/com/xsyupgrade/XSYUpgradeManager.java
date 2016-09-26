package com.xsyupgrade;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.groupcommerce.droidbsdiff.BSPatch;
import com.rkhd.ingage.app.db.LoginUser;
import com.rkhd.ingage.app.model.User;
import com.rkhd.ingage.core.cache.DBSharedPreference;
import com.rkhd.ingage.core.ipc.tools.Url;

/**
 * Created by yeewang on 16/6/30.
 */
public class XSYUpgradeManager extends ReactContextBaseJavaModule {


    Context mContext;
    public XSYUpgradeManager(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }


    @ReactMethod
    public void setVersion(String version){

        BSPatch.setCurrentVersion(mContext,version);
    }

    @ReactMethod
    public String baseVersion(Promise promise){
        String version = BSPatch.getBaseVersion(mContext);
        version =  (version == null) ? "0" : version;
        promise.resolve(version);
        return version;

    }

    @ReactMethod
    public String currentVersion(Promise promise){
        String version = BSPatch.getCurrentVersion(mContext);
        version =  (version == null) ? "0" : version;
        promise.resolve(version);
        return version;
    }

    @ReactMethod
    public void setBaseVersion(String version){
        BSPatch.setBaseVersion(mContext,version);
    }

    @ReactMethod
    public boolean versionDesc(String source,String target){
        return BSPatch.compareVersion(source,target) < 0;
    }

    @ReactMethod
    public String currentVersionBundleUrl(String version,final Promise promise){

        String url =  BSPatch.getBundleUrlFromVersion(mContext,version);
        promise.resolve(url);
        return url;
    }


    @ReactMethod
    public void combine(String patchPath, String newVersion){
        String newFile = BSPatch.getBundleUrlFromVersion(mContext,newVersion);
        String oldFile = BSPatch.getBundleUrlFromVersion(mContext,BSPatch.getCurrentVersion(mContext));

        BSPatch bsPatch = new BSPatch();
        int result = bsPatch.bspatch(oldFile,
                newFile,
                patchPath);
        setVersion(newVersion);
    }

    @Override
    public String getName() {
        return "XSYUpgradeManager";
    }
}
