package com.thinksolutionz.foodies;

import android.app.Application;

import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.airbnb.android.react.maps.MapsPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNPermissionsPackage(),
            new VectorIconsPackage(),
            new LocationServicesDialogBoxPackage(),
            new RNSharePackage(),
            new MapsPackage(),
            new RNFirebasePackage(),
            new ImagePickerPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new MyAppPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
    @Override
    public String getFileProviderAuthority() {
        return "com.thinksolutionz.foodies.provider";
    }
}
