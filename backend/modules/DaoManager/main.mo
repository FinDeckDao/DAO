import Buffer "mo:base/Buffer";
import Result "mo:base/Result";

module {
  public let name : Text = "FinDeck DAO";

  public func getName() : Text {
    name;
  };

  public func addGoal(goals : [Text], newGoal : Text) : ([Text], Result.Result<(), Text>) {
    let buffer = Buffer.fromArray<Text>(goals);
    buffer.add(newGoal);
    (Buffer.toArray(buffer), #ok());
  };
};
