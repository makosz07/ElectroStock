package electrostock.com;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {

    private static final String TAG = "ElectroStockAds";
    private static final String PRODUCTION_REWARDED_AD_UNIT_ID =
            "ca-app-pub-5377025591382161/1298262034";
    private static final String TEST_REWARDED_AD_UNIT_ID =
            "ca-app-pub-3940256099942544/5224354917";
    private static final int REQ_CREATE_JSON = 1001;
    private static final int REQ_OPEN_JSON = 1002;
    private WebView webView;
    private String pendingExportJson = "";
    private ConsentInformation consentInformation;
    private RewardedAd rewardedAd;
    private boolean adsInitialized;
    private boolean rewardedAdLoading;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        FrameLayout root = new FrameLayout(this);

        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        ProgressBar progress = new ProgressBar(this, null,
                android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100);
        root.addView(progress, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, 6));

        setContentView(root);

        requestConsentAndInitializeAds();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progress.setProgress(newProgress);
                progress.setVisibility(newProgress < 100 ? View.VISIBLE : View.GONE);
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                android.util.Log.d("ES_WebView",
                        cm.sourceId() + ":" + cm.lineNumber() + " - " + cm.message());
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin,
                    GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri uri = req.getUrl();
                String scheme = uri.getScheme();
                if ("http".equals(scheme) || "https".equals(scheme)) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    } catch (Exception e) {
                        android.util.Log.e("ES_WebView", "Cannot open URL: " + uri);
                    }
                    return true;
                }
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progress.setVisibility(View.GONE);
                notifyPrivacyOptionsAvailability();
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
    }

    public class AndroidBridge {
        @JavascriptInterface
        public void exportJson(String fileName, String json) {
            runOnUiThread(() -> {
                pendingExportJson = json == null ? "" : json;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                intent.putExtra(Intent.EXTRA_TITLE, fileName == null || fileName.isEmpty() ? "electrostock_export.json" : fileName);
                startActivityForResult(intent, REQ_CREATE_JSON);
            });
        }

        @JavascriptInterface
        public void importJson() {
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                startActivityForResult(intent, REQ_OPEN_JSON);
            });
        }

        @JavascriptInterface
        public void showRewardedAd() {
            runOnUiThread(MainActivity.this::showRewardedAdIfAvailable);
        }

        @JavascriptInterface
        public void showPrivacyOptions() {
            runOnUiThread(() -> UserMessagingPlatform.showPrivacyOptionsForm(
                    MainActivity.this,
                    formError -> {
                        if (formError != null) {
                            android.util.Log.w(TAG, formError.getMessage());
                            runJs("window.privacyOptionsError && window.privacyOptionsError()");
                        }
                        if (consentInformation != null && consentInformation.canRequestAds()) {
                            initializeAdsOnce();
                        }
                        notifyPrivacyOptionsAvailability();
                    }
            ));
        }
    }

    private void requestConsentAndInitializeAds() {
        consentInformation = UserMessagingPlatform.getConsentInformation(this);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();

        consentInformation.requestConsentInfoUpdate(
                this,
                params,
                () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(
                        MainActivity.this,
                        formError -> {
                            if (formError != null) {
                                android.util.Log.w(TAG, formError.getMessage());
                            }
                            if (consentInformation.canRequestAds()) initializeAdsOnce();
                            notifyPrivacyOptionsAvailability();
                        }
                ),
                requestConsentError -> {
                    android.util.Log.w(TAG, requestConsentError.getMessage());
                    if (consentInformation.canRequestAds()) initializeAdsOnce();
                    notifyPrivacyOptionsAvailability();
                }
        );

        if (consentInformation.canRequestAds()) initializeAdsOnce();
    }

    private synchronized void initializeAdsOnce() {
        if (adsInitialized) return;
        adsInitialized = true;
        new Thread(() -> MobileAds.initialize(
                MainActivity.this,
                initializationStatus -> runOnUiThread(this::loadRewardedAd)
        )).start();
    }

    private void loadRewardedAd() {
        if (rewardedAdLoading || rewardedAd != null) return;
        if (consentInformation == null || !consentInformation.canRequestAds()) return;

        rewardedAdLoading = true;
        boolean debugBuild = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        String adUnitId = debugBuild
                ? TEST_REWARDED_AD_UNIT_ID
                : PRODUCTION_REWARDED_AD_UNIT_ID;

        RewardedAd.load(
                this,
                adUnitId,
                new AdRequest.Builder().build(),
                new RewardedAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd ad) {
                        rewardedAdLoading = false;
                        rewardedAd = ad;
                        runJs("window.rewardedAdAvailability && window.rewardedAdAvailability(true)");
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        rewardedAdLoading = false;
                        rewardedAd = null;
                        android.util.Log.w(TAG, "Rewarded ad failed to load: " + error.getMessage());
                        runJs("window.rewardedAdAvailability && window.rewardedAdAvailability(false)");
                    }
                }
        );
    }

    private void showRewardedAdIfAvailable() {
        if (consentInformation == null || !consentInformation.canRequestAds()) {
            runJs("window.rewardedAdUnavailable && window.rewardedAdUnavailable('consent')");
            return;
        }

        if (rewardedAd == null) {
            loadRewardedAd();
            runJs("window.rewardedAdUnavailable && window.rewardedAdUnavailable('loading')");
            return;
        }

        RewardedAd ad = rewardedAd;
        rewardedAd = null;
        final boolean[] rewardEarned = {false};

        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdDismissedFullScreenContent() {
                if (!rewardEarned[0]) {
                    runJs("window.rewardedAdClosed && window.rewardedAdClosed(false)");
                }
                loadRewardedAd();
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError error) {
                android.util.Log.w(TAG, "Rewarded ad failed to show: " + error.getMessage());
                runJs("window.rewardedAdUnavailable && window.rewardedAdUnavailable('show')");
                loadRewardedAd();
            }
        });

        ad.show(this, rewardItem -> {
            rewardEarned[0] = true;
            runJs("window.rewardedAdFinished && window.rewardedAdFinished()");
        });
    }

    private void notifyPrivacyOptionsAvailability() {
        if (consentInformation == null) return;
        boolean required = consentInformation.getPrivacyOptionsRequirementStatus()
                == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED;
        runJs("window.privacyOptionsAvailability && window.privacyOptionsAvailability(" + required + ")");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_OK || data == null || data.getData() == null) return;
        Uri uri = data.getData();
        try {
            if (requestCode == REQ_CREATE_JSON) {
                try (OutputStream out = getContentResolver().openOutputStream(uri)) {
                    if (out != null) out.write(pendingExportJson.getBytes(StandardCharsets.UTF_8));
                }
                pendingExportJson = "";
                runJs("window.nativeExportDone && window.nativeExportDone(true)");
            } else if (requestCode == REQ_OPEN_JSON) {
                String json = readAll(uri);
                runJs("window.receiveImportedJson && window.receiveImportedJson(" + jsString(json) + ")");
            }
        } catch (Exception e) {
            android.util.Log.e("ES_WebView", "File operation failed", e);
            if (requestCode == REQ_CREATE_JSON) runJs("window.nativeExportDone && window.nativeExportDone(false)");
            if (requestCode == REQ_OPEN_JSON) runJs("window.nativeImportError && window.nativeImportError()");
        }
    }

    private String readAll(Uri uri) throws Exception {
        try (InputStream in = getContentResolver().openInputStream(uri);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buf = new byte[8192];
            int n;
            while (in != null && (n = in.read(buf)) != -1) out.write(buf, 0, n);
            return out.toString("UTF-8");
        }
    }

    private void runJs(String js) {
        if (webView != null) webView.post(() -> webView.evaluateJavascript(js, null));
    }

    private String jsString(String s) {
        if (s == null) return "''";
        StringBuilder b = new StringBuilder("'");
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '\\': b.append("\\\\"); break;
                case '\'': b.append("\\'"); break;
                case '\n': b.append("\\n"); break;
                case '\r': b.append("\\r"); break;
                case '\t': b.append("\\t"); break;
                default:
                    if (c < 32) b.append(String.format("\\u%04x", (int)c));
                    else b.append(c);
            }
        }
        b.append("'");
        return b.toString();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();
        // pauseTimers() affects every WebView in this process, including the
        // WebView used by Google Mobile Ads. Calling it here can freeze the
        // rewarded ad countdown and its close/install controls.
        if (webView != null) webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) { webView.stopLoading(); webView.destroy(); }
        super.onDestroy();
    }
}
