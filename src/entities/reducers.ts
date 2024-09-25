import account from 'app/entities/account/account.reducer';
import group from 'app/entities/group/group.reducer';
import externalSource from 'app/entities/external-source/externalSource.reducer';
import attributeProfile from 'app/entities/attribute-profile/attributeProfile.reducer';
import tenantSetting from 'app/entities/tenant-setting/tenant-setting.reducer';
import smsProvider from 'app/entities/sms-provider/sms-provider.reducer';
import admin from 'app/entities/administration/admin.reducer';
import userTemp from 'app/entities/user/usertemp.reducer';
import radiusRule from 'app/entities/radius-rule/radiusrule.reducer';
import loggingAudit from 'app/entities/logging-audit/loggingAudit.reducer';
import loggingRadius from 'app/entities/logging-radius/loggingRadius.reducer';
import manage from 'app/entities/mentis/manage/manage.reducer';
import gatewayRadius from './gateway-radius/gatewayRadius.reducer';
import gatewayLdap from './gateway-ldap/gatewayLdap.reducer';
import dashboard from 'app/entities/dashboard/dashboard.reducer';
import userportal from 'app/entities/user-portal/useerportal.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  account,
  admin,
  userTemp,
  group,
  radiusRule,
  attributeProfile,
  externalSource,
  gatewayLdap,
  gatewayRadius,
  tenantSetting,
  smsProvider,
  loggingAudit,
  loggingRadius,
  manage,
  dashboard,
  userportal,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
