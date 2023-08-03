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
      Full_Name__C,
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
