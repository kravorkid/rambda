import { partialCurry } from 'rambda'

describe('partialCurry', () => {
  it('happy', () => {
    interface Input{
      a: number
      b: string
      c: boolean
    }
    type PartialInput = Pick<Input, Exclude<keyof Input, "c">>;
    function fn(input: Input){
      return input.c ? input.a: input.b
    }

    const curried = partialCurry<Input, PartialInput, string|number>(fn, {a:1, b:'foo'});  // $ExpectType (input: Pick<Input, any>) => string | number
    const result = curried({c:false}) // $ExpectType string | number
  });
});
