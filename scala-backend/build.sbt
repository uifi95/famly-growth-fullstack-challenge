name := "ParentProfileBackend"

version := "0.1.0"

scalaVersion := "2.13.14"

// Add library dependencies
libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-http" % "10.2.9",
  "com.typesafe.akka" %% "akka-stream" % "2.6.19",
  "org.sangria-graphql" %% "sangria" % "3.0.0",
  "org.sangria-graphql" %% "sangria-circe" % "1.3.2",
  "io.circe" %% "circe-core" % "0.14.1",
  "io.circe" %% "circe-parser" % "0.14.1",
  "de.heikoseeberger" %% "akka-http-circe" % "1.39.2",
  "com.typesafe.slick" %% "slick" % "3.3.3",
  "com.typesafe.slick" %% "slick-hikaricp" % "3.3.3",
  "mysql" % "mysql-connector-java" % "8.0.26",
  "ch.megard" %% "akka-http-cors" % "1.1.3",
  "org.scalatest" %% "scalatest" % "3.2.19" % "test"
)




