package utils

import (
	"math"
	"reflect"
)

// Contains return true if the list contais the element.
func Contains(list interface{}, elem interface{}) bool {
	listV := reflect.ValueOf(list)

	if listV.Kind() == reflect.Slice {
		for i := 0; i < listV.Len(); i++ {
			item := listV.Index(i).Interface()

			target := reflect.ValueOf(elem).Convert(reflect.TypeOf(item)).Interface()
			if ok := reflect.DeepEqual(item, target); ok {
				return true
			}
		}
	}
	return false
}

// Round rounds a decimal number
func Round(number float64, precision int) float64 {
	return math.Round(number*(math.Pow10(precision))) / math.Pow10(precision)
}
