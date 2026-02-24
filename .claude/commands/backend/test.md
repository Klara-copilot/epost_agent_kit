---
description: (ePost) Run backend tests with Maven
agent: epost-backend-developer
---

Run backend tests for $ARGUMENTS.

## Instructions

1. Run unit tests: `mvn test`
2. If integration tests requested: `mvn verify -Parquillian`
3. Check JaCoCo coverage report
4. Report any failures with analysis
