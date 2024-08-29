import DaoManager "main";
import Debug "mo:base/Debug";
import Result "mo:base/Result";

// Main test function
func runTests() {
  testGetName();
  testAddGoal();
};

// Test getName function
func testGetName() {
  Debug.print("Testing getName function...");
  let expectedName = "FinDeck DAO";
  let actualName = DaoManager.getName();

  assert actualName == expectedName;
  Debug.print("getName test passed!");
};

// Test addGoal function
func testAddGoal() {
  Debug.print("Testing addGoal function...");

  // Test case 1: Adding a goal to an empty array
  var goals : [Text] = [];
  let newGoal1 = "Increase user engagement";
  let (updatedGoals1, result1) = DaoManager.addGoal(goals, newGoal1);

  assert updatedGoals1.size() == 1;
  assert updatedGoals1[0] == newGoal1;
  assert Result.isOk(result1);
  Debug.print("addGoal test case 1 passed!");

  // Test case 2: Adding a goal to a non-empty array
  let newGoal2 = "Implement new features";
  let (updatedGoals2, result2) = DaoManager.addGoal(updatedGoals1, newGoal2);

  assert updatedGoals2.size() == 2;
  assert updatedGoals2[0] == newGoal1;
  assert updatedGoals2[1] == newGoal2;
  assert Result.isOk(result2);
  Debug.print("addGoal test case 2 passed!");
};

// Run all tests
runTests();
