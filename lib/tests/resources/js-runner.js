/*
   Author:
   Creation Date:
   Automation for:
      <Company> <App Name>

*/

//Primary Task Excecution------------------------------
function runApp() {
  /*
      Start writing your automation here.

      See reference
         2_Android_Functionality.js
         3_Android_Basic_Login_Example.js
         4_Complex_Auatomation_Example.js for more examples
      for more help.
   */

  //Example element call
  waitFor({ element: { text: "LOGIN" }, maxWaitInMs: 30000 })[0].click();
} //runApp.close

// Main Functionality ------------------------------

/*
   This will accept any permissions by default.
   You can change to false to deny requests by default
*/
onPermissionRequest(function (request) {
  return true;
});

//Wait for app to load
sleep(4000);

//initial Screenshot
screenshot();

//Attempt to run steps, call to function
try {
  //Message Logging
  log("\n\nNew Pass\n\n");

  //Prinary automation functionaity call.
  runApp();

  //Message Logging
  log("\n\nAutomation Completed\n\n");
} catch (e) {
  //try.close

  //Log which element we were attempting to find.
  log(e.message);
} finally {
  //catch.close

  //Buffer for final screen to set
  sleep(4000);

  //last screen shot
  screenshot();
} //finally.close
