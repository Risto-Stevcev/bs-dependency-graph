@test "should generate a dependency graph in JSON format" {
  run diff <(cd test && node ..) <(cat test/expected.json)
  [ "$status" -eq 0 ]
}
