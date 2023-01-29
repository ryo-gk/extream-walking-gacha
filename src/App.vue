<script setup lang="ts">
import { computed, ref } from 'vue'
import { data } from 'virtual:vite-plugin-stations'
import AButton from './components/AButton.vue'
import ASelect from './components/ASelect.vue'
import ARadio from './components/ARadio.vue'
import ATwitterShareButton from './components/ATwitterShareButton.vue'
import { SelectGacha } from './Gacha'

type Prefecture = 'tokyo' | 'kanagawa' | 'osaka'

const prefecture = ref<Prefecture>('tokyo')
const moneyMin = ref(1000)
const moneyMax = ref(3000)
const stayingTimeMin = ref(120)
const stayingTimeMax = ref(240)
const prohibitedCard = ref('')
const useProhibitedCard = ref(true)

const resultStation = ref('???')
const resultMoney = ref('???')
const resultStayingTime = ref('???')
const resultProhibitedCard = ref('???')

const resultForTweet = computed(() => {
  const message = `【エクストリームさんぽガチャ 結果】%0a${resultStation.value}駅しゅうへんで%0a${resultStayingTime.value}、%0a${resultMoney.value}円ですごす。`

  return message + (useProhibitedCard.value ? `%0a※ただし${resultProhibitedCard.value}` : '')
})

const progressResultStation = ref(0)
const progressResultMoney = ref(0)
const progressResultStayingTime = ref(0)
const progressResultProhibitedCard = ref(0)

const doingGacha = computed(() => {
  // Be careful, this logic depends on that the gacha starts with Station and end with ProhibitedCard.
  return progressResultStation.value > 0
    && progressResultProhibitedCard.value < 100
})

const doneGacha = computed(() => {
  return progressResultStation.value >= 100
    && progressResultMoney.value >= 100
    && progressResultStayingTime.value >= 100
    && progressResultProhibitedCard.value >= 100
})

const moneyOptionsMin = computed(() => moneyOptions.filter(o => o.value < moneyMax.value))
const moneyOptionsMax = computed(() => moneyOptions.filter(o => o.value > moneyMin.value))
const stayingTimeOptionsMin = computed(() => stayingTimeOptions.filter(o => o.value < stayingTimeMax.value))
const stayingTimeOptionsMax = computed(() => stayingTimeOptions.filter(o => o.value > stayingTimeMin.value))

const prefectureOptions = [
  { label: 'とうきょう', value: 'tokyo' },
  { label: 'かながわ', value: 'kanagawa' },
  { label: 'おおさか', value: 'osaka' }
]

const moneyOptions = [
  { label: '500', value: 500 },
  { label: '1000', value: 1000 },
  { label: '1500', value: 1500 },
  { label: '2000', value: 2000 },
  { label: '2500', value: 2500 },
  { label: '3000', value: 3000 },
  { label: '3500', value: 3500 },
  { label: '4000', value: 4000 },
  { label: '4500', value: 4500 },
  { label: '5000', value: 5000 },
  { label: '5500', value: 5500 },
  { label: '6000', value: 6000 },
  { label: '6500', value: 6500 },
  { label: '7000', value: 7000 },
  { label: '7500', value: 7500 },
  { label: '8000', value: 8000 },
  { label: '8500', value: 8500 },
  { label: '9000', value: 9000 },
  { label: '9500', value: 9500 },
  { label: '10000', value: 10000 }
]

const stayingTimeOptions = [
  { label: '30ふん', value: 30 },
  { label: '1じかん', value: 60 },
  { label: '1じかん30ふん', value: 90 },
  { label: '2じかん', value: 120 },
  { label: '2じかん30ふん', value: 150 },
  { label: '3じかん', value: 180 },
  { label: '3じかん30ふん', value: 210 },
  { label: '4じかん', value: 240 },
  { label: '4じかん30ふん', value: 270 },
  { label: '5じかん', value: 300 },
  { label: '5じかん30ふん', value: 330 },
  { label: '6じかん', value: 360 },
]

const prohibitedCardOptions = [
  { label: '公園禁止', value: 1 },
  { label: 'コンビニ禁止', value: 2 },
  { label: '読書禁止', value: 3 },
  { label: '宗教施設禁止', value: 4 },
  { label: '坂禁止', value: 5 },
  { label: '駅前禁止', value: 6 },
  { label: '橋禁止', value: 7 },
  { label: '商店街禁止', value: 8 },
  { label: '飲食店入店禁止', value: 9 },
  { label: '食べ歩き禁止', value: 10 },
  { label: '公共施設禁止', value: 11 }
]

const useProhibitedCardOptions = [
  { label: 'はい', value: true },
  { label: 'いいえ', value: false }
]

function rollGacha() {
  resetProgressResult()

  const staionGacha = new SelectGacha({
    options: getStationList(data, prefecture.value)
  })
  const moneyGacha = new SelectGacha({ 
    options: moneyOptions.filter(({value}) => value >= moneyMin.value && value <= moneyMax.value).map(option => option.label)
  })
  const stayingTimeGacha = new SelectGacha({
    options: stayingTimeOptions.filter(({value}) => value >= stayingTimeMin.value && value <= stayingTimeMax.value).map(option => option.label)
  })
  const prohibitedCardGacha = new SelectGacha({
    options: prohibitedCardOptions.map(option => option.label)
  })

  resultStation.value = staionGacha.roll()
  resultMoney.value = moneyGacha.roll()
  resultStayingTime.value = stayingTimeGacha.roll()
  resultProhibitedCard.value = prohibitedCardGacha.roll()

  provideProgress()
}

function getStationList(data: any, prefecture: Prefecture): string[] {
  // Tokyo: 13, Kanagawa: 14, Osaka: 27
  const pref_cd = 
      prefecture === 'tokyo' ? 13
    : prefecture === 'kanagawa' ? 14
    : 27

  return Array.from(new Set(data[pref_cd].map((d: any) => d.station_name)))
}

function provideProgress() {
  let intervalIdStation: NodeJS.Timer | null
  let intervalIdMoney: NodeJS.Timer | null
  let intervalIdStayingTime: NodeJS.Timer | null
  let intervalIdProhibitedCard: NodeJS.Timer | null

  intervalIdStation = setInterval(() => {
    if (progressResultStation.value < 100) { 
      progressResultStation.value += 1
    }
  }, 20)

  intervalIdMoney = setInterval(() => {
    if (progressResultStation.value >= 100 && progressResultMoney.value < 100) { 
      progressResultMoney.value += 1
    }
  }, 35)

  intervalIdStayingTime = setInterval(() => {
    if (progressResultStation.value >= 100 && progressResultMoney.value >= 100 && progressResultStayingTime.value < 100) { 
      progressResultStayingTime.value += 1
    } else if (!useProhibitedCard.value) {
      clearIntervalAll()
    }
  }, 50)

  if (useProhibitedCard.value) {
    intervalIdProhibitedCard = setInterval(() => {
      if (
        progressResultStation.value >= 100
        && progressResultMoney.value >= 100
        && progressResultStayingTime.value >= 100
        && progressResultProhibitedCard.value < 100
      ) { 
        progressResultProhibitedCard.value += 1
      } else {
        clearIntervalAll()
      }
    }, 30)
  } else {
    progressResultProhibitedCard.value = 100
  }
  
  function clearIntervalAll() {
    if (doneGacha.value) {
      intervalIdStation && clearInterval(intervalIdStation)
      intervalIdMoney && clearInterval(intervalIdMoney)
      intervalIdStayingTime && clearInterval(intervalIdStayingTime)
      intervalIdProhibitedCard && clearInterval(intervalIdProhibitedCard)
    }
  }
}

function resetProgressResult() {
  progressResultStation.value = 0
  progressResultMoney.value = 0
  progressResultStayingTime.value = 0
  progressResultProhibitedCard.value = 0
}
</script>

<template>
  <div class="App">
    <div class="title-container nes-container">
      <h1 class="title-value">エクトリーム<wbr>さんぽガチャ</h1>
    </div>
    <div class="form nes-container with-title">
      <p class="title">設定</p>
      <p class="nes-balloon from-left baloon">
        さんぽするちいきを入力してください
      </p>
      <div class="input-container">
        <ASelect class="select" :options="prefectureOptions" v-model="prefecture" />
      </div>

      <p class="nes-balloon from-left baloon">
        お金のはんいを入力してください
      </p>
      <div class="input-container">
        <ASelect class="select" :options="moneyOptionsMin" v-model="moneyMin" /> から
        <ASelect class="select" :options="moneyOptionsMax" v-model="moneyMax" /> のあいだ
      </div>

      <p class="nes-balloon from-left baloon">
        たいざい時間のはんいを入力してください
      </p>
      <div class="input-container">
        <ASelect class="select" :options="stayingTimeOptionsMin" v-model="stayingTimeMin" /> から
        <ASelect class="select" :options="stayingTimeOptionsMax" v-model="stayingTimeMax" /> のあいだ
      </div>

      <p class="nes-balloon from-left baloon">
        封印かーどを使いますか？
      </p>
      <div class="input-container">
        <ARadio class="radio" :options="useProhibitedCardOptions" v-model="useProhibitedCard" />
      </div>

      <div>
        <AButton 
          class="roll-btn"
          label="ガチャを回す"
          :disabled="doingGacha"
          @clicked="rollGacha"
        />
      </div>
    </div>

    <div class="result-container nes-container with-title">
      <h2 class="title">けっか</h2>

      <div class="result-outer">
        <h3 class="label">えき</h3>
        <div class="result-box">
          <progress v-if="progressResultStation < 100" class="progress nes-progress is-primary" :value="progressResultStation" max="100"></progress>
          <div v-else class="result">{{ resultStation }}</div>
        </div>

        <h3 class="label">お金</h3>
        <div class="result-box">
          <progress v-if="progressResultMoney < 100" class="progress nes-progress is-primary" :value="progressResultMoney" max="100"></progress>
          <div v-else class="result">{{ resultMoney }}円</div>
        </div>

        <h3 class="label">たいざい時間</h3>
        <div class="result-box">
          <progress v-if="progressResultStayingTime < 100" class="progress nes-progress is-primary" :value="progressResultStayingTime" max="100"></progress>
          <div v-else class="result">{{ resultStayingTime }}</div>
        </div>

        <template v-if="useProhibitedCard">
          <h3 class="label">封印かーど</h3>
          <div class="result-box">
            <progress v-if="progressResultProhibitedCard < 100" class="progress nes-progress is-primary" :value="progressResultProhibitedCard" max="100"></progress>
            <div v-else class="result">{{ resultProhibitedCard }}</div>
          </div>               
        </template>
      </div>

      <div class="actions">
        <ATwitterShareButton
          class="share-btn"
          label="けっかをツイートする"
          :text="resultForTweet"
          url="https://www.xsanpo.com/"
          hashtags="エクストリームさんぽ"
          :disabled="!doneGacha"
        />
      </div>
    </div>

    <div class="credit-container">
      <p class="label"># 制作</p>
      <div class="record">
        <p>
          きかく　タピ山
          <a
            href="https://twitter.com/tapi_yama"
            target="_blank" rel="noopener noreferrer"
          >
            <i class="nes-icon twitter sns-icon"></i>
          </a>
        </p>
        <p>
          かいはつ　Greko
          <a
            href="https://twitter.com/ryo_gk55"
            target="_blank" rel="noopener noreferrer"
          >
            <i class="nes-icon twitter sns-icon"></i>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
h1 { font-size: 32px; }
h2 { font-size: 24px; margin-bottom: 12px; }
h3 { font-size: 16px; }

.App {
  padding: 64px 0 40px;
  background-color: #ffffff;
}

.label {
  margin: 12px 0 8px;
}

.select {
  padding-bottom: 4px;
}

.with-title > .title { 
  font-size: 20px;
}

.title-value {
  text-align: center;
  font-size: 24px;
  color: #007bff;
  word-break: keep-all;
  overflow-wrap: break-word;

  @media (min-width: 768px) {
    font-size: 32px;
  }
}

.title-container, .form, .result-container, .credit-container {
  width: 300px;
  margin: 0 auto;
  background-color: #ffffff;

  @media (min-width: 768px) {
    width: 500px;
  }
}

.container-title {
  text-align: center;
  font-size: 28px;
  color: #92cc41; 
}

.input-container {
  margin: 8px 0 36px;
  padding-left: 16px;
}

.form, .result-container {
  margin-top: 16px;
}

.roll-btn {
  width: 100%;
}

.result {
  padding-left: 16px;
}

.result-box > .progress {
  height: 28px;
}

.result-box {
  min-height: 44px;
}

.actions {
  display: flex;
}

.share-btn {
  flex-grow: 1;
  margin-top: 40px;
}

.credit-container {
  margin-top: 56px;
  text-align: center;
}

.sns-icon {
  margin: 0;
  transform: scale(1.3);
}

.form > .baloon {
  padding: 0.5rem 1.5rem;
}
</style>
