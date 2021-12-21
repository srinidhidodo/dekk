export class UrlConstants {
  // Mock REST calls - dev only
  // public static GET_TAGS_URL = '/dekk/tags';
  // public static HOME_URL = '/dekk/home';
  // public static NEXT_CARD_URL = '/dekk/cards/next';
  // public static PREV_CARD_URL = '/dekk/cards/previous';
  // public static SAVE_DEKK_DETAILS = '/dekk/save';
  // public static SAVE_CARD_DATA_URL = '/dekk/save';

  // Actual REST calls
  private static BASE_URL = '/api/v1';
  public static GET_TAGS_URL = UrlConstants.BASE_URL + '/tags/all';
  public static HOME_URL = UrlConstants.BASE_URL + '/users/home';
  public static SEARCH_URL = UrlConstants.BASE_URL + '/cards/search';
  public static CARDS_FROM_TAG_URL = UrlConstants.BASE_URL + '/cards/tags';
  public static CARDS_FROM_DEKK_ID_URL = UrlConstants.BASE_URL + '/study/dekk';
  public static REGISTER_URL = UrlConstants.BASE_URL + '/register';
  public static LOGIN_URL = UrlConstants.BASE_URL + '/login';
  public static DEKK_DETAILS_URL = UrlConstants.BASE_URL + '/select/dekk';
  public static DEKK_METADATA_URL = UrlConstants.BASE_URL + '/dekk';
  public static DEKK_DATA_URL = UrlConstants.BASE_URL + '/dekk';
  public static CARD_DATA_URL = UrlConstants.BASE_URL + '/card';
  public static SAVE_DEKK_DETAILS = UrlConstants.BASE_URL + '/dekk';
  public static SAVE_CARD_DATA_URL = UrlConstants.BASE_URL + '/card';
  public static GET_COLLEGES_URL = UrlConstants.BASE_URL + '/resources/colleges';

  // Routing URLs
  public static SEARCH_RESULTS = '/search-results';
  public static HOME = '/home';
  public static CREATE = '/create';
  public static STUDY_CARD = '/study-card';
  public static DEKK_EDIT_VIEW = '/dekk-edit-view';
  public static CARD_EDIT_VIEW = '/card-edit-view';
  public static LANDING = '/landing';
  public static ABOUT_US = '/about';
  public static WHY_DEKK = '/why-dekk';
  public static STUDY_SESSION = '/study-session';
}
