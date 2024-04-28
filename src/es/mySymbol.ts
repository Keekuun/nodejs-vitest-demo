const forMap: Record<string, any> = {}

export function MySymbol(description: string | number = '') {
  if (new.target) {
    throw new Error('MySymbol is not a constructor')
  }

  const _description = description === undefined ? '' : String(description)

  return Object.create({
    toString() {
      return `MySymbol(${_description})`
    },
    valueOf() {
      return `MySymbol(${_description})`
    }
  })
}

MySymbol.for = function (description?: string) {
  const _description = String(description)
  return forMap[_description] ? forMap[_description] : forMap[_description] = MySymbol(_description);
}

MySymbol.keyFor = function (symbol?: any) {
  if(!symbol || typeof symbol !== 'object' || !symbol?.toString().startsWith('MySymbol(')) {
    throw new Error(`${symbol} is not a MySymbol`)
  }
  for (let key in forMap) {
    if (forMap[key] === symbol) return key;
  }
}
