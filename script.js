

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

/*exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
*/


//インスタンスの生成
var inputValue = document.getElementById('valueInput');
var updateButton = document.getElementById('updateButton');
var comments = document.getElementById('comments');

//Firebase Realtime databaseへアクセス
var db = firebase.database();
var root = db.ref("/");
var chatDir = db.ref("/chat");
var indexDir = db.ref("/index");

//コメント送信
function submit() {
  //日付取得
  var yyyymmddhhmiss = getDate();
  //index取得
  indexDir.on("child_added", function(snapshot) {
    var index = parseInt(snapshot.val());

    var inputValueData = inputValue.value;


    //データベースにコメント送信
    if (inputValueData != "" && inputValue.value != null) {
      if (inputValueData.length <= 150) {

        //匿名認証
        firebase.auth().signInAnonymously().catch(function(error) {
          if (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert('認証エラーです!残念!!次の数字を報告してください!!: ' + error.code);
          }
        });

        //匿名ID取得
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // user id取得
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;

            //データ送信
            var tmp = chatDir.push();
            tmp.set({
              comment: inputValueData, createStmp: yyyymmddhhmiss, index: index, "uid": uid
            });

            //インデックスを増やす
            index = index + 1;
            indexDir.set({
              "index": index
            });
          } else {
            console.log(isAnonymous)
          }
        })
      } else {
        alert('150文字以内でコメントしてね');
      }
    }

    //プレースホルダー初期化
    inputValue.value = "";
  })


}

//コメントレンダリング
chatDir.on("child_added", function(snapshot) {
  //databaseからindex・userID・日付・コメントを取得
  var indexData = toDoubleDigits(snapshot.val().index)
  var userIdData = snapshot.val().uid
  var createStmpData = snapshot.val().createStmp
  var commentData = snapshot.val().comment

  /**コメ番(index)部分 */
  //コメントヘッダ部分div要素作成
  var newCommentHeadDiv = document.createElement("div");
  newCommentHeadDiv.className = "commentHead_render"
  //コメントヘッダ作成
  var commentHeadData = indexData + ".";
  var commentHead = document.createTextNode(commentHeadData);
  newCommentHeadDiv.appendChild(commentHead);

  /**userID部分 */
  //userId部分div要素作成
  var newUserIdDiv = document.createElement("a");
  newUserIdDiv.className = "userId_render"
  newUserIdDiv.href = "https://215215.playcode.io?" + userIdData;
  //userId作成
  var userId = document.createTextNode(userIdData);
  newUserIdDiv.appendChild(userId);


  var blankDiv = document.createElement("div");

  /**日付部分 */
  //日付部分div要素作成
  var newDateDiv = document.createElement("div");
  newDateDiv.className = "date_render"
  //日付作成
  var date = document.createTextNode(createStmpData);
  newDateDiv.appendChild(date);



  /**コメント部分 */
  //コメント部分div要素作成
  var newCommentDiv = document.createElement("div");
  newCommentDiv.className = "comment_render";
  //コメント作成
  var comment = document.createTextNode(commentData);
  newCommentDiv.appendChild(comment);

  /**
  //HTMLへ反映
  */
  document.body.insertBefore(newCommentHeadDiv, comments);
  document.body.insertBefore(newUserIdDiv, comments);
  document.body.insertBefore(blankDiv, comments);
  document.body.insertBefore(newDateDiv, comments);
  document.body.insertBefore(newCommentDiv, comments);
  comments = newCommentHeadDiv;

  /****
  もっとスマートにHTMLに反映させたいなあ
  newDiv.innerHTML = '<div id="temp"></div>';
  document.getElementById('temp').innerHTML = commentAndCreateStmp;
  comment.addChild(newDiv);
  */

  /*/////以下のように間違えやすい
  snapshot.forEach(function(value){
    console.log(value.val());
    //日付取得
    var newDiv = document.createElement("div");
    var newContent = document.createTextNode(value.val());
    newDiv.appendChild(newContent);
    document.body.insertBefore(newDiv, comments);
    newDiv = ""
  });
  */
});
// 1桁の数字を0埋めで2桁にする
var toDoubleDigits = function(num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
  return num;
};
// 日付をYYYY/MM/DD HH:DD:MI:SS形式で取得
function getDate() {
  var date = new Date();
  var yyyy = date.getFullYear();
  var mm = toDoubleDigits(date.getMonth() + 1);
  var dd = toDoubleDigits(date.getDate());
  var hh = toDoubleDigits(date.getHours());
  var mi = toDoubleDigits(date.getMinutes());
  var ss = toDoubleDigits(date.getSeconds());
  return yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + mi + ":" + ss;
};


//エンターキー押下時の挙動
$('#valueInput').keypress(function (e) {
  if (e.which == 13) {
    // ここに処理を記述
    console.log("aaa")
    return false;
  }
});
