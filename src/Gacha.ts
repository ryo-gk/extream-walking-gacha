export interface Gacha {
  roll(): any
}

export interface SelectGachaArgs {
  options: string[]
}

export class SelectGacha implements Gacha {
  options: string[]

  constructor(args: SelectGachaArgs) {
    this.options = args.options
  }

  roll() {
    const getRondomNumber = (size: number) => Math.floor(Math.random() * size)

    const index = getRondomNumber(this.options.length)
    return this.options[index]
  }
}
