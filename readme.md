# 小難しくないJavascript（ES6）とユニットテストの自動化

## 留意事項とか前提とか（ひとまとめ）

* cloneして使う場合はnpm installしてくだしあ
* 多分1時間でユニットテストの自動化を体験できる（はず）
* 説明はmacOSベースで進めます。
* 長いだけで小難しくないから
* Node.js, npmがインストール済み
* ES6をふわっと何となく読める
* 長いだけで小難しくないです
* Babelが何だかふわっと理解してる
* IDEは何でもOK
* npm install -gはしないよ
* 小難しいこと書いてません
* 雑いので補足おなしゃす

ずぼらな人はglobalは止めておいた方が良いっすよ、多分。

## 概要

ネイティブのJavascriptも好きだけどES6書けないとダメよねーってことでES6の環境を作ろう。  
それとは関係なくユニットテスト（単体試験）、大事ですよね。ってことでES6をベースにテストまで軽くお勉強しましょうってことです。  
結構雑い感じの記事になると思うのでツッコミお待ちしております。  

## ES6について

ECMAScript2015のこと。ネイティブの糖衣構文っすね。  
ただネイティブのJavascriptではないのでコンパイルしてブラウザとかで動くようにしないとダメ。  
ElectronとかはNode.jsがランタイムになってるのでコンパイルしなくても動くとかそういうアレ。  
コンパイルはBabelっていう何か響きがかっこいいものを使う。  
詳細は以下。  
http://es6-features.org

### ES6で書くメリット

ネイティブよりクールなコードが書けるよ。  
ごめん、それぐらい。だけどそれが大事。  
CSSもJavascriptもネイティブで書く時代じゃないんすよ（ってどこかの偉い人が言ってた）。  

## ユニットテストについて

### ユニットテストって何？

ざっくり言うと関数のテストのことです。  
ざっくり言わないとするなら「ソフトウェアのサブルーチンが想定（仕様）通り振る舞っているか確認を行う」という感じでしょうか。  
「ソフトウェアのサブルーチン＝関数」「想定（仕様）通り振る舞っているか確認＝テスト」なので「関数のテスト」って感じっすね。  
「関数の集合体＝ソフトウェア」となるので関数同士を繋げて正常に動作するか確認するのが「結合試験」になりますね。  
この辺りの切り分けはプロジェクトはアーキテクトによっても異なるところがあるので、とりあえずは「ユニットテスト＝関数のテスト」で覚えてOKかと思います。  
この辺は高野さんとか辻口さんとかが詳しい気がします。何となくイメージで。
※個人的にはOOPであれば「クラス単位で正しい振る舞いをしているか否か」を検証するのがユニットテストだと思ってます。  
Fluxとかアーキテクトが正常化どうかって何試験なんすかね。アーキテクト作るのをひとつのプロジェクトと捉えれば解決しそうっすけど。

### ユニットテストをするメリット

不具合を洗い出せるよね。  
仕様通りであることが保証されるよね。  
良いことしか無いね！ユニットテストすごい！  

### 全部の関数をユニットテストする必要があるのか

ユニットテストをする必要は...ありまぁす！（キッパリ）  
というか品質を担保するために必須です。

### ユニットテストを自動で行う

どんな関数でもユニットテストができるかどうかと言うと「できない」となります。  
自動でテストできるものは「〇〇が△△になる」という仕様の関数のみです。  
つまりユニットテストの自動化は「引数と戻り値がある関数」しか行えない、ということになります。  
※やってやれないわけではないです。  
ってことはテストの自動化をするには「引数と戻り値がある関数」を作らないといけないわけです。  
副作用とかその辺の話を出すべきだとは思うのですが、長くなるのでいつかまた。

## いざ、ユニットテストの自動化

無駄に前置きが長くなったので早速やりませう。

### お試しBabel

以下のサイトでBabelのお試しができます。  
https://babeljs.io/repl/  
左のエリアに以下のコード（ES6）を入力してみましょう。ネイティブなJavascriptに変換されます。  
```
class human {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    say(str) {
        return `I\'m ${this.name}:) ${str}`;
    }
}
```
とりあえずESなら何でも良いや的なアレでコードに意味は無いです。

### プロジェクト作成と設定

#### プロジェクトディレクトリ作成

適当にプロジェクトディレクトリを作ります。  
※コマンドから作る必要はありません。
```
mkdir js_test
```

#### 必要パッケージのインストール

human.es6として/js_test/src/に保存しましょう。この後、テストコードとして利用します。  
続いてnpm initとか必要なパッケージをインストールしていきます。  
initは適当にEnter連打でOKです。
```
cd js_test
npm init
npm install --save-dev babel-cli
npm install --save-dev babel-preset-es2015
```
```
{
  "name": "js_test",
  "version": "1.0.0",
  "description": "",
  "main": "human.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-es2015": "^6.24.1"
  }
}
```
こんな感じのpackage.jsonができるかと思います。  
※babel-cliのバージョンは指定しない限り変わる可能性があります。

#### Babel設定ファイルの作成

まずは設定ファイルを作成します。ファイル名は「.babelrc」です。  
内容は以下の通り。
```
{
  "presets": ["es2015"]
}
```
ES6をコンパイルするよーってな感じです。  

#### コンパイルしてみる

Terminalを起動してプロジェクトルートディレクトリで以下のコマンドを実行します。
```
./node_modules/.bin/babel ./src/human.es6
```
Terminalにコンパイルした結果がズバババババーッと表示されます。  
「-o」オプションを付与するとコンパイル結果を保存できます。  
実行前に出力用にjs_test直下にlibディレクトを作成しておいてください。
```
./node_modules/.bin/babel ./src/human.es6 -o ./lib/human.js
```
これでlibディレクトリ配下にhuman.jsという名前でコンパイルされたJavascriptが保存されます。便利だね。  
いちいち「./node_modules/.bin/babel ./src/human.es6 -o ./lib/human.js」とタイプするのは面倒の極みなのでpackage.jsonのscriptに書いていきましょう。 ついでにディレクトリ単位でコンパイルするようにしておきましょう。ディレクトリ単位でコンパイルする時は「-d」オプションを使用します。
```
:,
"scripts": {
  "es6build": "./node_modules/.bin/babel ./src/ -d ./lib/",
  "test": "echo \"Error: no test specified\" && exit 1"
},
:
```
これで以下のコマンドをタイプすると自動的にディレクトリ単位でコンパイルされます。
```
npm run es6build
```
Node.js便利だね。  
「-w」オプションでウォッチもできるよ。
```
:,
"scripts": {
  "es6build": "./node_modules/.bin/babel ./src/ -d ./lib/",
  "es6buildw": "./node_modules/.bin/babel -w ./src/ -d ./lib/",
  "test": "echo \"Error: no test specified\" && exit 1"
},
:
```
Terminalで以下のコマンドを実行するとウォッチ開始です。
```
npm run es6buildw
```
Node.js便利だね（人生でn回目）。Node.jsだけにn回目とかそういう。  

ES6とBabelについてはこんな感じでユニットテストに進んで行きます。

### ユニットテストしてみる

書いたES6のコードをmochaを使ってテストしていきます。  
ES6コードをテストするわけではありませんのでネイティブJavascriptを書いてる場合にも同じようにテストできます。

#### mochaのインストール

mochaはテストフレームワークになります。とりあえず難しいことを考えずインストールしていきましょう。
```
npm install --save-dev mocha
```
パッケージ名は複数指定することができます。覚えておかなくても良いと思います。  
以下でmochaのバージョンを確認できます。
```
node_modules/.bin/mocha --version
```

#### テストコードを書いていく...その前に

human.es6を開いてclassの前にexportを追加します。
```
export class human {
  :
}
```
exportは他のファイル（モジュール）で利用可能にする感じです。
逆に他のファイルやモジュールの機能（classやfunction）を利用する場合はimportが必要となります。

#### テストコードを書いていく

まずはテスト用のコードを保存するディレクトリを...プロジェクトルートディレクトリ直下にtestディレクトリを作ります。  
作ったらtestディレクトリ内にtest.jsを作成し、以下のコードを貼り付けて保存します。
```
var assert = require("assert");
var human = require("../lib/human");
var h = new human.human("hoge piyo", 99);
describe("human class test", function () {
    it("say method", function () {
        assert.equal("I'm hoge piyo:) Hello!", h.say("Hello!"));
    });
});
```
おぉん？exportしたらimportするんじゃないんかーい！となりそうですが、test.jsはES6ではなくcommonJSなのでimportが使えません。そのためrequireでexportされたものを扱えるようにしています。  
テストファイルでもES6を書けるようにする方法もありますが、今回はこのままで。  
何となく見てわかると思いますが、アサートはitに書いてdescribeでitを管理する感じです。describeはネストできるんで上手いこと構造化していくとGoodだと思います。
assertについてはchaiとか使うと色々拡張できますので遊んでみて下さい。chaiのインストールは以下の通り。  
```
npm install --save-dev chai
```
詳細は以下。  
http://www.chaijs.com/api/assert/  
書き疲れてきた。

#### テスト実行

プロジェクトルートで以下のコマンドを実行。
```
node_modules/.bin/mocha ./test/test.js
```
なんかわちゃわちゃ動いて...
```

human class test
  ✓ say method

1 passing (6ms)

```
こんな感じの結果が表示されたかと思います。  
見た目通り...human class testのsay methodテストがパスしたよってことです。  
test.jsのassert.equalの第一引数の文字列をテストがパスしないケースに改変して再度実行してみましょう。
```

human class test
  1) say method


0 passing (7ms)
1 failing

1) human class test
     say method:

    AssertionError [ERR_ASSERTION]: 'I\'m hoge piyo:( Hello!' == 'I\'m hoge piyo:) Hello!'
    + expected - actual

    -I'm hoge piyo:( Hello!
    +I'm hoge piyo:) Hello!

    at Context.<anonymous> (test/test.js:6:16)

```
テストをパスしなかったよーってことですね、見たまんまです。  
いつも通りいちいち長いコマンド叩くのは面倒なのでpackage.jsonのscriptsに追加していきます。
```
:,
"scripts": {
  "es6build": "./node_modules/.bin/babel ./src/ -d ./lib/",
  "es6buildw": "./node_modules/.bin/babel -w ./src/ -d ./lib/",
  "test": "node_modules/.bin/mocha ./test/test.js"
},
:
```
書いた後は...
```
npm run test
```
これでテスト実行可能になります。やったね。

## 最後に

駆け足でしたが、ES6の環境作ってBabelでコンパイルしてmochaでテストするところまで一通り流れは見えたかと思います。ユニットテストの自動化はJavascriptだけじゃなく様々な言語でテストフレームワークが用意されています。アサート書いておけばコマンド一発で勝手にテストをやってくれるわけです。すごくない？  
現場でテストコードを書くことがあるかもしれませんし無いかもしれませんが、こういう方法もあるんだなーと知っておいてもらえればと思います。テストは自動化してコードを書くことに集中してパフォーマンス出して行きませう！  
それとJavascript（ES6）楽しいよ、ほんと。  

コード書くの楽しいですね ;-)
