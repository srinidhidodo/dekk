export class UrlConstants {
  private static BASE_URL = '/api/v1';
  // REST calls
  public static GET_TAGS_URL = '/dekk/tags';
  // public static HOME_URL = '/dekk/home';
  public static HOME_URL = UrlConstants.BASE_URL + '/users/home';
  public static SEARCH_URL = UrlConstants.BASE_URL + '/cards/search';
  public static NEXT_CARD_URL = '/dekk/cards/next';
  public static PREV_CARD_URL = '/dekk/cards/previous';
  public static CARDS_FROM_TAG_URL = UrlConstants.BASE_URL + '/cards/tags';
  public static REGISTER_URL = UrlConstants.BASE_URL + '/register';
  public static LOGIN_URL = UrlConstants.BASE_URL + '/login';

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
}
