# Useful Queries

## GitHub Contribution Calendar
```
query { 
  user(login: "morgante") { 
    contributionsCollection {
      earliestRestrictedContributionDate
      latestRestrictedContributionDate
      contributionCalendar {
        totalContributions
      }
    }
  }
}
```