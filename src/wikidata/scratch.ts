//
//
// const categoricalBlackList = [
// ["encyclopedic article"],
//     ["album", "audio signal"]
//     ["brewery"]
//     ["Wikimedia category;"]
//     ["asteroid;"]
//     ["video game;"]
//     ["airport; "]
// ]
//
// const major = [
//     ["abstract being"]
// ]
//
// const q = `
// # SELECT DISTINCT ?sourceLabel ?sourceInstanceOfLabel ?propertyLabel ?targetLabel ?targetInstanceOfLabel WHERE {
// SELECT DISTINCT ?sourceInstanceOfLabel ?sourceInstanceOf ?targetInstanceOfLabel ?targetInstanceOf WHERE {
//     ?source ?_p wd:Q275051 .
//     ?source ?srcP ?target .
//     ?property wikibase:directClaim ?srcP; wikibase:propertyType ?srcPropType .
//     FILTER(?srcPropType = wikibase:WikibaseItem && STR(?property) != "instance of") .
//     ?source wdt:P31 ?sourceInstanceOf .
//     ?target wdt:P31 ?targetInstanceOf .
//     # BIND({?targetInstanceOf}UNION{?sourceInstanceOf} as ?label)
//     #BIND(?targetInstanceOf as ?label)
//
//     # FILTER(?propertyLabel != "instance of") .
//     #OPTIONAL{
//     #  ?srcV ?tgtP ?tgtV .
//    #   ?tgtProp wikibase:directClaim ?tgtP; wikibase:propertyType ?tgtPropType .
//    #   FILTER(?tgtPropType = wikibase:WikibaseItem && STR(?tgtProp) != "instance of") .
//    #   BIND(?srcV as ?source) .
//    #   ?tgtV wdt:P31 ?srcVInstanceOf .
//   #    BIND(?srcVInstanceOf as ?srcInstanceOf) .
//   #    BIND(?tgtProp as ?property) .
//   #    BIND(?tgtV as ?target) .
//  #   }
//
//   SERVICE wikibase:label {
//     bd:serviceParam wikibase:language "en" .
//   }
// }`
//
//
// const q = `
// SELECT DISTINCT ?parent ?sourceInstanceOf WHERE {
//     ?source ?_p wd:Q275051 .
//     ?source wdt:P31 ?sourceInstanceOf .
//     ?sourceInstanceOf wdt:P279* ?parent .
//
//   SERVICE wikibase:label {
//     bd:serviceParam wikibase:language "en" .
//   }
// }`