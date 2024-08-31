import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Types "../../types";

module {
  public func registerMember(members : [(Principal, Types.Member)], member : Types.Member, caller : Principal) : ([(Principal, Types.Member)], Result.Result<(), Text>) {
    let membersBuffer = Buffer.fromArray<(Principal, Types.Member)>(members);

    switch (Buffer.indexOf<(Principal, Types.Member)>((caller, member), membersBuffer, func((p1, _), (p2, _)) = p1 == p2)) {
      case null {
        // Force the role to Student regardless of what was passed in.
        let newMember = (caller, { name = member.name; role = #Student });
        membersBuffer.add(newMember);
        (Buffer.toArray(membersBuffer), #ok());
      };
      case (?_) (members, #err("Member by this name already exists."));
    };
  };

  public func getMember(members : [(Principal, Types.Member)], p : Principal) : Result.Result<Types.Member, Text> {
    // Create a result variable to hold the result of the search.
    let result = Array.find<(Principal, Types.Member)>(
      members,
      func((principal, _)) {
        principal == p;
      },
    );

    // Make sure the compairson is done on the long version of both the input Principla and the Principals in the array.
    switch (result) {
      case (null) #err("Member does not exist");
      case (?(_, member)) #ok(member);
    };
  };

  public func getAllMembers(members : [(Principal, Types.Member)]) : [Types.Member] {
    Array.map<(Principal, Types.Member), Types.Member>(members, func(_, member) = member);
  };

  public func numberOfMembers(members : [(Principal, Types.Member)]) : Nat {
    members.size();
  };

  public func graduate(members : [(Principal, Types.Member)], student : Principal, caller : Principal) : async ([(Principal, Types.Member)], Result.Result<(), Text>) {
    switch (getMember(members, caller)) {
      case (#err(_)) { (members, #err("Caller does not exist as a member")) };
      case (#ok(member)) {
        if (member.role != #Mentor) {
          return (members, #err("Only mentors can graduate a student"));
        };
        switch (getMember(members, student)) {
          case (#err(e)) { (members, #err(e)) };
          case (#ok(studentMember)) {
            if (studentMember.role != #Student) {
              return (members, #err("Member is not a student"));
            };
            let updatedMembers = Array.map<(Principal, Types.Member), (Principal, Types.Member)>(
              members,
              func(p, m) {
                if (p == student) { (p, { name = m.name; role = #Graduate }) } else {
                  (p, m);
                };
              },
            );
            (updatedMembers, #ok());
          };
        };
      };
    };
  };
};
