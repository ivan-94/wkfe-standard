const API_LIST = new Set([
  'clearStorageSync',
  'getBatteryInfoSync',
  'getExtConfigSync',
  'getFileSystemManager',
  'getLaunchOptionsSync',
  'getStorageInfoSync',
  'getStorageSync',
  'getSystemInfoSync',
  'offAccelerometerChange',
  'offAppHide',
  'offAppShow',
  'offAudioInterruptionBegin',
  'offAudioInterruptionEnd',
  'offBLECharacteristicValueChange',
  'offBLEConnectionStateChange',
  'offBluetoothAdapterStateChange',
  'offBluetoothDeviceFound',
  'offCompassChange',
  'offError',
  'offGetWifiList',
  'offGyroscopeChange',
  'offMemoryWarning',
  'offNetworkStatusChange',
  'offPageNotFound',
  'offUnhandledRejection',
  'offUserCaptureScreen',
  'onAccelerometerChange',
  'onAppHide',
  'onAppShow',
  'onAudioInterruptionBegin',
  'onAudioInterruptionEnd',
  'onBLECharacteristicValueChange',
  'onBLEConnectionStateChange',
  'onBeaconServiceChange',
  'onBeaconUpdate',
  'onBluetoothAdapterStateChange',
  'onBluetoothDeviceFound',
  'onCompassChange',
  'onDeviceMotionChange',
  'onError',
  'onGetWifiList',
  'onGyroscopeChange',
  'onMemoryWarning',
  'onNetworkStatusChange',
  'onPageNotFound',
  'onSocketClose',
  'onSocketError',
  'onSocketMessage',
  'onSocketOpen',
  'onUnhandledRejection',
  'onUserCaptureScreen',
  'removeStorageSync',
  'reportAnalytics',
  'setStorageSync',
  'arrayBufferToBase64',
  'base64ToArrayBuffer',
  'canIUse',
  'createAnimation',
  'createCameraContext',
  'createCanvasContext',
  'createInnerAudioContext',
  'createIntersectionObserver',
  'createInterstitialAd',
  'createLivePlayerContext',
  'createMapContext',
  'createSelectorQuery',
  'createVideoContext',
  'getBackgroundAudioManager',
  'getMenuButtonBoundingClientRect',
  'getRecorderManager',
  'getUpdateManager',

  // no promise
  'getAccountInfoSync',
  'getEnterOptionsSync',
  'offBLEPeripheralConnectionStateChanged',
  'offBeaconServiceChange',
  'offBeaconUpdate',
  'offDeviceMotionChange',
  'offHCEMessage',
  'offKeyboardHeightChange',
  'offLocalServiceDiscoveryStop',
  'offLocalServiceFound',
  'offLocalServiceLost',
  'offLocalServiceResolveFail',
  'offLocationChange',
  'offThemeChange',
  'offVoIPChatInterrupted',
  'offVoIPChatMembersChanged',
  'offVoIPVideoMembersChanged',
  'offWifiConnected',
  'offWindowResize',
  'onBLEPeripheralConnectionStateChanged',
  'onBackgroundAudioPause',
  'onBackgroundAudioPlay',
  'onBackgroundAudioStop',
  'onBackgroundFetchData',
  'onHCEMessage',
  'onKeyboardHeightChange',
  'onLocalServiceDiscoveryStop',
  'onLocalServiceFound',
  'onLocalServiceLost',
  'onLocalServiceResolveFail',
  'onLocationChange',
  'onThemeChange',
  'onVoIPChatInterrupted',
  'onVoIPChatMembersChanged',
  'onVoIPChatSpeakersChanged',
  'onVoIPVideoMembersChanged',
  'onWifiConnected',
  'onWindowResize',
  'reportMonitor',
  'onGyroscopeChange',
  'offGyroscopeChange',
  'createAudioContext',
  'createLivePusherContext',
  'createMediaContainer',
  'createMediaRecorder',
  'createOffscreenCanvas',
  'createRewardedVideoAd',
  'createUDPSocket',
  'createVideoDecoder',
  'createWorker',
  'getLogManager',
  'getNFCAdapter',
  'getPerformance',
  'getRealtimeLogManager',
  'pauseBackgroundAudio',
  'pauseVoice',
  'reportPerformance',
  'stopBackgroundAudio',
  'stopRecord',
  'stopVoice',
  'onBluetoothDeviceFound',
  'onBluetoothAdapterStateChange',
  'offBluetoothDeviceFound',
  'offBluetoothAdapterStateChange',
  'onBLEConnectionStateChange',
  'onBLECharacteristicValueChange',
  'offBLEConnectionStateChange',
  'offBLECharacteristicValueChange',
  'onCopyUrl',
  'offCopyUrl',

  'addPhoneContact',
  'authorize',
  'canvasGetImageData',
  'canvasPutImageData',
  'canvasToTempFilePath',
  'checkSession',
  'chooseAddress',
  'chooseImage',
  'chooseInvoiceTitle',
  'chooseLocation',
  'chooseVideo',
  'clearStorage',
  'closeBLEConnection',
  'closeBluetoothAdapter',
  'closeSocket',
  'compressImage',
  'connectSocket',
  'createBLEConnection',
  'downloadFile',
  'getAvailableAudioSources',
  'getBLEDeviceCharacteristics',
  'getBLEDeviceServices',
  'getBatteryInfo',
  'getBeacons',
  'getBluetoothAdapterState',
  'getBluetoothDevices',
  'getClipboardData',
  'getConnectedBluetoothDevices',
  'getConnectedWifi',
  'getExtConfig',
  'getFileInfo',
  'getImageInfo',
  'getLocation',
  'getNetworkType',
  'getSavedFileInfo',
  'getSavedFileList',
  'getScreenBrightness',
  'getSetting',
  'getStorage',
  'getStorageInfo',
  'getSystemInfo',
  'getUserInfo',
  'getWifiList',
  'hideHomeButton',
  'hideShareMenu',
  'hideTabBar',
  'hideTabBarRedDot',
  'loadFontFace',
  'login',
  'makePhoneCall',
  'navigateBack',
  'navigateBackMiniProgram',
  'navigateTo',
  'navigateToBookshelf',
  'navigateToMiniProgram',
  'notifyBLECharacteristicValueChange',
  'hideKeyboard',
  'hideLoading',
  'hideNavigationBarLoading',
  'hideToast',
  'openBluetoothAdapter',
  'openDocument',
  'openLocation',
  'openSetting',
  'pageScrollTo',
  'previewImage',
  'queryBookshelf',
  'reLaunch',
  'readBLECharacteristicValue',
  'redirectTo',
  'removeSavedFile',
  'removeStorage',
  'removeTabBarBadge',
  'requestSubscribeMessage',
  'saveFile',
  'saveImageToPhotosAlbum',
  'saveVideoToPhotosAlbum',
  'scanCode',
  'sendSocketMessage',
  'setBackgroundColor',
  'setBackgroundTextStyle',
  'setClipboardData',
  'setEnableDebug',
  'setInnerAudioOption',
  'setKeepScreenOn',
  'setNavigationBarColor',
  'setNavigationBarTitle',
  'setScreenBrightness',
  'setStorage',
  'setTabBarBadge',
  'setTabBarItem',
  'setTabBarStyle',
  'showActionSheet',
  'showFavoriteGuide',
  'showLoading',
  'showModal',
  'showShareMenu',
  'showTabBar',
  'showTabBarRedDot',
  'showToast',
  'startBeaconDiscovery',
  'startBluetoothDevicesDiscovery',
  'startDeviceMotionListening',
  'startPullDownRefresh',
  'stopBeaconDiscovery',
  'stopBluetoothDevicesDiscovery',
  'stopCompass',
  'startCompass',
  'startAccelerometer',
  'stopAccelerometer',
  'showNavigationBarLoading',
  'stopDeviceMotionListening',
  'stopPullDownRefresh',
  'switchTab',
  'uploadFile',
  'vibrateLong',
  'vibrateShort',
  'writeBLECharacteristicValue',

  // promise
  'addCard',
  'authPrivateMessage',
  'checkIsOpenAccessibility',
  'checkIsSoterEnrolledInDevice',
  'checkIsSupportSoterAuthentication',
  'chooseInvoice',
  'chooseMedia',
  'chooseMessageFile',
  'compressVideo',
  'connectWifi',
  'createBLEPeripheralServer',
  'disableAlertBeforeUnload',
  'enableAlertBeforeUnload',
  'exitVoIPChat',
  'getBLEDeviceRSSI',
  'getBackgroundAudioPlayerState',
  'getBackgroundFetchData',
  'getBackgroundFetchToken',
  'getGroupEnterInfo',
  'getHCEState',
  'getSelectedTextRange',
  'getShareInfo',
  'getVideoInfo',
  'getWeRunData',
  'join1v1Chat',
  'joinVoIPChat',
  'makeBluetoothPair',
  'openCard',
  'openVideoEditor',
  'playBackgroundAudio',
  'playVoice',
  'previewMedia',
  'requestPayment',
  'saveFileToDisk',
  'scanItem',
  'seekBackgroundAudio',
  'sendHCEMessage',
  'setBLEMTU',
  'setBackgroundFetchToken',
  'setEnable1v1Chat',
  'setTopBarText',
  'setWifiList',
  'setWindowSize',
  'showRedPackage',
  'startGyroscope',
  'startHCE',
  'startLocalServiceDiscovery',
  'startLocationUpdate',
  'startLocationUpdateBackground',
  'startRecord',
  'startSoterAuthentication',
  'startWifi',
  'stopGyroscope',
  'stopHCE',
  'stopLocalServiceDiscovery',
  'stopLocationUpdate',
  'stopWifi',
  'subscribeVoIPVideoMembers',
  'updateShareMenu',
  'updateVoIPChatMuteConfig',
  'updateWeChatApp',
  'sendBizRedPacket',
  'getUserProfile',
  'stopBluetoothDevicesDiscovery',
  'startBluetoothDevicesDiscovery',
  'openBluetoothAdapter',
  'getConnectedBluetoothDevices',
  'getBluetoothDevices',
  'getBluetoothAdapterState',
  'closeBluetoothAdapter',
  'writeBLECharacteristicValue',
  'readBLECharacteristicValue',
  'notifyBLECharacteristicValueChange',
  'getBLEDeviceServices',
  'getBLEDeviceCharacteristics',
  'createBLEConnection',
  'closeBLEConnection',
  'startFacialRecognitionVerify',
]);

const GLOBAL_OBJECT = new Set(['Taro', 'wx', 'qq', 'tt', 'swan', 'my', 'jd']);

const STYLE_EXTS = ['.scss', 'css'];

const DATA_SET_WHITE_LIST = new Set(['data-scoped', 'data-fixme']);

module.exports = {
  API_LIST,
  GLOBAL_OBJECT,
  STYLE_EXTS,
  DATA_SET_WHITE_LIST,
};
