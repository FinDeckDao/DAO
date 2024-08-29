import Principal "mo:base/Principal";

module {
  public type WebpageManager = {
    getIdWebpage : () -> Principal;
  };

  public func create(canisterIdWebpage : Principal) : WebpageManager {
    {
      getIdWebpage = func() : Principal {
        canisterIdWebpage;
      };
    };
  };

  public func createDefault() : WebpageManager {
    create(Principal.fromText("bnz7o-iuaaa-aaaaa-qaaaa-cai"));
  };
};
