const { inRange } = require('lodash/fp');

const excludePiiIfNotSignedUp = (request) => {
  const {
    Travel_companions_without_PII__c,
    signUpInfo,
    RecordType,
    Id,
    Airport__c,
    Party_Size__c,
    Arrival_Date__c,
    Arrival_Time__c,
    Airport_Ride_Friends__c,
    Date_Begins__c,
    Move_Out_Date__c,
    Contact: {
      Home_Country__c,
      Student_Campus__c,
      Gender__c,
      Degree_Level__c,
      Intials__C,
      ...ContactPii
    },
    Account,
    Volunteer__r,
    Host_Family_account__r,
    ...RequestPii
  } = request;

  const { isSignedUp, isPendingApproval } = signUpInfo;
  const isApproved = isSignedUp && !isPendingApproval;

  const initials = Name // Calculate initials from Name
  ? Name.split(' ').map(part => part.charAt(0)).join('')
  : '';
  const age = ContactPii.Age__c;
  const ageRange = age
    ? inRange(0, 18, age)
      ? 'under 18'
      : inRange(18, 23, age)
      ? '18-22'
      : inRange(23, 29, age)
      ? '23-28'
      : 'over 28'
    : null;

  return {
    Travel_companions_without_PII__c,
    signUpInfo,
    RecordType,
    Id,
    Airport__c,
    Party_Size__c,
    Arrival_Date__c,
    Arrival_Time__c,
    Airport_Ride_Friends__c,
    Date_Begins__c,
    Move_Out_Date__c,
    ...(isApproved ? RequestPii : {}),
    Contact: {
      Home_Country__c,
      Student_Campus__c,
      Gender__c,
      Degree_Level__c,
      Age_Range__c: ageRange,
      Intials__C: initials, //adding intials
      ...(isApproved ? ContactPii : {}),
    },
    Volunteer__r: isApproved ? Volunteer__r : {},
    Host_Family_account__r: isApproved
      ? Host_Family_account__r
      : {},
  };
};
