# mayusukiBot-API
まゆすきbotとAPIの提供．

なんの役に立つんだろう．ぼくにはわからない．

## Bot
これ

https://twitter.com/mayusukiCount

1日の終わりに今日つぶやかれた「まゆすき」が含まれるツイート数をカウントするbot

カウント対象は`"まゆすき" -rt`で引っかかるツイート．佐久間まゆを対象としたまゆすき以外にも引っかかるファジーなまゆすきが対象となる．(こればっかりはしょうがない)

1ツイート内に何回「まゆすき」と書いてあってもそれは1まゆすきとする．

後は日曜日にその週のまゆすきカウント遷移をグラフ化してツイートする．下図みたいな感じの．

![](https://pbs.twimg.com/media/DPh5bVcU8AAR4AI.jpg:orig)


## API
以下のURLをGETアクセスすると保存してるまゆすきカウントデータを返す．形式はJSON

https://script.google.com/macros/s/AKfycbwPDUJ4-EKuSJSptDJBBAqqZK-CNM9_Q4Q5avAdnHxcPHe7Z7A6/exec

保存しているまゆすきカウントは2017/11/12～このサービスを止めるまでの期間のみ．

### Parameters
|Name|Required|Description|Example|
|:-|:-|:-|:-|
|since|◯|与えられた日付以降にマッチするデータを返す．形式は`YYYY/MM/DD`|2017/11/12|
|until|◯|与えられた日付以前にマッチするデータを返す．形式は`YYYY/MM/DD`|2017/11/20|
|callback||JSONPで呼び出したい場合に使用する．指定した名前のコールバック関数を返す|mayuIsSoCute|

### Example Request & Response
`since`に`2017/11/20`，`until`に`2017/11/22`を与えたリクエスト例

https://script.google.com/macros/s/AKfycbwPDUJ4-EKuSJSptDJBBAqqZK-CNM9_Q4Q5avAdnHxcPHe7Z7A6/exec?since=2017/11/20&until=2017/11/22

レスポンス例

```javascript
{
    "data": [
        {
            "id": 9,
            "date": "2017-11-20T00:00:00.000Z",
            "count": 292
        },
        {
            "id": 10,
            "date": "2017-11-21T00:00:00.000Z",
            "count": 662
        },
        {
            "id": 11,
            "date": "2017-11-22T00:00:00.000Z",
            "count": 336
        }
    ]
}
```

`since`に`2017/11/12`，`until`に`2017/11/15`，`Callback`に`mayuIsSoCute`を与えたリクエスト例

https://script.google.com/macros/s/AKfycbwPDUJ4-EKuSJSptDJBBAqqZK-CNM9_Q4Q5avAdnHxcPHe7Z7A6/exec?callback=mayuIsSoCute&since=2017/11/12&until=2017/11/15

レスポンス例

```jacascript
mayuIsSoCute({
    "data": [
        {
            "id": 1,
            "date": "2017-11-12T00:00:00.000Z",
            "count": 468
        },
        {
            "id": 2,
            "date": "2017-11-13T00:00:00.000Z",
            "count": 290
        },
        {
            "id": 3,
            "date": "2017-11-14T00:00:00.000Z",
            "count": 305
        },
        {
            "id": 4,
            "date": "2017-11-15T00:00:00.000Z",
            "count": 251
        }
    ]
})
```
