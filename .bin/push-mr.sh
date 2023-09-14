#!/usr/bin

# 工程信息
PROJECT_ID=1297
TIME=$(date "+%Y%m%d%H%M%S")
NEW_BRANCH="GitLabCIBuild-${TIME}"
PRIVATE_TOKEN="xJUUXJVDK1rdSLDAYbzn"

# 钉钉
DD_AT_ALL="false"
DD_TITLE="合并请求通知"
DD_REASON="Merge_Request_待合并至主分支"
CI_MERGE_REQUESTS_URL="${CI_PROJECT_URL}/-/merge_requests"
DD_AT_MOBILES_STRING="@18842605303@13782683626"
DD_AT_MOBILES_ARRAY="['18842605303','13782683626']"
DD_TOKEN="5db33f2369be2505bc21939f62ef18cc2e3f74a22915150bac8b9ab4a3b77375"

# 创建分支
curl --request POST --header "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" "${CI_API_V4_URL}/projects/${PROJECT_ID}/repository/branches?branch=${NEW_BRANCH}&ref=$1"
echo "MR_INFO: 添加「${NEW_BRANCH}」分支完成"

# MR data
MR_DATA="{\"id\":\"${PROJECT_ID}\",\"source_branch\":\"${NEW_BRANCH}\",\"target_branch\":\"master\",\"private_token\":\"${PRIVATE_TOKEN}\",\"title\":\"GitLabCI Build Auto Submit Merge Resquest\",\"description\":\"GitLabCI构建自动提交merge request\"}"

# 生成MR
curl -X POST -d "${MR_DATA}" -H "Content-Type: application/json, PRIVATE-TOKEN: ${PRIVATE_TOKEN}" "${CI_API_V4_URL}/projects/${PROJECT_ID}/merge_requests"
echo "MR_INFO: 提交MR完成"

# 钉钉通知
# DD_DATA="{\"msgtype\": \"markdown\",\"markdown\": {\"title\":\"${DD_TITLE}\",\"text\": \"#### **[${CI_PROJECT_NAME}](${CI_PROJECT_URL})**\n --- \n > - 构建任务: ${CI_BUILD_NAME} \n > -  构建分支: [${CI_COMMIT_TAG}](${CI_MERGE_REQUESTS_URL}) \n > - 触发原因: ${DD_REASON} \n > - 执行人: ${GITLAB_USER_NAME} \n > - 提交信息: ${CI_COMMIT_MESSAGE} \n\n ${DD_AT_MOBILES_STRING}\"},\"at\": {\"isAtAll\": ${DD_AT_ALL}, \"atMobiles\":${DD_AT_MOBILES_ARRAY}}}"

# curl -X POST -d "${DD_DATA}" -H "Content-Type: application/json" "https://oapi.dingtalk.com/robot/send?access_token=${DD_TOKEN}"
echo "MR_INFO: 请查收钉钉MR通知并及时将正确的代码合并至主分支"