# JaCoCo Coverage Configuration

Reference for JaCoCo Maven plugin setup, coverage enforcement, exclusions, and multi-module reporting.

---

## Complete Maven Plugin Configuration

Add to the `<build><plugins>` section of `pom.xml`:

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>

        <!-- 1. Instrument Surefire (unit tests) -->
        <execution>
            <id>prepare-agent</id>
            <goals><goal>prepare-agent</goal></goals>
            <!-- Binds to initialize — runs automatically before the test phase -->
        </execution>

        <!-- 2. Instrument Failsafe (integration tests) -->
        <execution>
            <id>prepare-agent-integration</id>
            <goals><goal>prepare-agent-integration</goal></goals>
            <!-- Binds to pre-integration-test -->
        </execution>

        <!-- 3. Generate unit test report -->
        <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals><goal>report</goal></goals>
        </execution>

        <!-- 4. Generate integration test report -->
        <execution>
            <id>report-integration</id>
            <phase>post-integration-test</phase>
            <goals><goal>report-integration</goal></goals>
        </execution>

        <!-- 5. Enforce coverage minimums -->
        <execution>
            <id>check</id>
            <phase>verify</phase>
            <goals><goal>check</goal></goals>
            <configuration>
                <rules>
                    <rule>
                        <element>BUNDLE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.70</minimum>
                            </limit>
                            <limit>
                                <counter>BRANCH</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.60</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>

    </executions>
</plugin>
```

---

## Surefire Integration

`prepare-agent` binds to the `initialize` phase and appends `-javaagent:jacoco.jar` to the JVM arguments used by `maven-surefire-plugin`. No manual `argLine` configuration needed.

If you already have a custom `<argLine>` in Surefire, use the `@{argLine}` placeholder so JaCoCo can append its agent:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <argLine>@{argLine} -Xmx512m</argLine>
    </configuration>
</plugin>
```

---

## Failsafe Integration

`prepare-agent-integration` binds to `pre-integration-test`. The companion `report-integration` goal generates a separate `jacoco-it.exec` file, allowing unit and integration coverage to be reported separately or merged.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <configuration>
        <argLine>@{argLine}</argLine>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>integration-test</goal>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

---

## Coverage Targets

| Counter | Minimum | Rationale |
|---------|---------|-----------|
| LINE | 70% | Ensures all execution paths have at least one test |
| BRANCH | 60% | Covers conditional logic — if/else, switch, ternary |

Adjust per module maturity. Legacy modules may start lower (50%/40%) and ratchet up.

---

## Exclusion Patterns

Exclude generated code, value objects, and framework glue from coverage counts:

```xml
<execution>
    <id>check</id>
    <goals><goal>check</goal></goals>
    <configuration>
        <excludes>
            <!-- DTO / value objects — no logic to cover -->
            <exclude>**/dto/**/*.class</exclude>
            <exclude>**/model/**/*DTO.class</exclude>

            <!-- Generated code (e.g., from APT, OpenAPI codegen) -->
            <exclude>**/generated/**/*.class</exclude>
            <exclude>**/*_.class</exclude>           <!-- JPA metamodel -->

            <!-- Enums — branch coverage inflated by compiler switch tables -->
            <exclude>**/enums/**/*.class</exclude>

            <!-- JAX-RS application class — no business logic -->
            <exclude>**/*Application.class</exclude>
            <exclude>**/*RestConfig.class</exclude>

            <!-- Exception classes — typically just constructors -->
            <exclude>**/*Exception.class</exclude>
        </excludes>
    </configuration>
</execution>
```

Also applicable on the `report` goal via `<configuration><excludes>` to suppress excluded classes from the HTML report.

---

## Multi-Module Maven: Aggregate Report

In a multi-module project, each module generates its own `.exec` file. To get a unified report across all modules, create a dedicated reporting module (or use the parent POM):

```xml
<!-- In the reporting module's pom.xml -->
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <id>aggregate-report</id>
            <phase>verify</phase>
            <goals><goal>report-aggregate</goal></goals>
            <configuration>
                <dataFileIncludes>
                    <dataFileInclude>**/jacoco.exec</dataFileInclude>
                </dataFileIncludes>
                <outputDirectory>${project.reporting.outputDirectory}/jacoco-aggregate</outputDirectory>
            </configuration>
        </execution>
    </executions>
</plugin>
```

The reporting module must declare all source modules as `<dependencies>` (test scope) so `report-aggregate` can resolve their source files and class files.

---

## SonarQube Integration

SonarQube reads JaCoCo XML reports. Point it to the generated XML:

### Maven property (in pom.xml or command line)

```xml
<properties>
    <sonar.coverage.jacoco.xmlReportPaths>
        ${project.build.directory}/site/jacoco/jacoco.xml,
        ${project.build.directory}/site/jacoco-it/jacoco.xml
    </sonar.coverage.jacoco.xmlReportPaths>
</properties>
```

### sonar-project.properties (standalone analysis)

```properties
sonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml,target/site/jacoco-it/jacoco.xml
```

### Multi-module aggregate path

```xml
<sonar.coverage.jacoco.xmlReportPaths>
    ${project.basedir}/../reporting-module/target/site/jacoco-aggregate/jacoco.xml
</sonar.coverage.jacoco.xmlReportPaths>
```

**Note:** SonarQube requires the XML report format, not the `.exec` binary. Ensure the `report` goal runs before `sonar:sonar`. Bind `sonar:sonar` to the `verify` phase or run explicitly after `mvn verify`.
