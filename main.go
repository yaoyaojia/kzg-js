package main

import (
	"syscall/js"

	bls12381 "github.com/consensys/gnark-crypto/ecc/bls12-381"
	"github.com/consensys/gnark-crypto/ecc/bls12-381/fr"
)

func emptyG1() []byte {
	e := new(bls12381.G1Affine).Bytes()
	return e[:]
}

func hashToElement(hash [32]byte) []byte {
	var sc fr.Element
	sc.SetBytes(hash[:])
	res := sc.Bytes()
	return res[:]
}

func main() {
	js.Global().Set("hashToElement", js.FuncOf(func(this js.Value, p []js.Value) any {
		if len(p) != 1 {
			return nil
		}
		uint8Array := p[0]
		hashBytes := [32]byte{}
		hash := make([]byte, uint8Array.Length())
		js.CopyBytesToGo(hash, uint8Array)
		copy(hashBytes[:], hash)
		ret := hashToElement(hashBytes)
		back := js.Global().Get("Uint8Array").New(len(ret))
		js.CopyBytesToJS(back, ret)
		return back
	}))
	js.Global().Set("emptyG1", js.FuncOf(func(this js.Value, p []js.Value) any {

		e := emptyG1()
		back := js.Global().Get("Uint8Array").New(48)
		js.CopyBytesToJS(back, e)
		return back
	}))
	select {}
}
