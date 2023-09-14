#!/usr/bin

# 检查是否存在未合并的MR

PROJECT_ID=1297
PRIVATE_TOKEN="xJUUXJVDK1rdSLDAYbzn"

# 钉钉
DD=1
DD_AT_ALL="false"
DD_TITLE="合并请求通知"
DD_KEYWORD="部署服务报错"
DD_REASON="Merge_Request_待合并至主分支~"
DD_AT_MOBILES_STRING="@13782683626@18301307570"
DD_AT_MOBILES_ARRAY="['13782683626','18301307570']"
DD_TOKEN="5db33f2369be2505bc21939f62ef18cc2e3f74a22915150bac8b9ab4a3b77375"

parse_json(){
echo "${1//\"/}" | sed "s/.*$2:\([^,}]*\).*/\1/"
}


# 拉取MR
MR_RESULT=$(curl --request GET --header "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" "https://gitlab.meishubao.com/api/v4/projects/${PROJECT_ID}/merge_requests?state=opened")
echo "${MR_RESULT}"
EMPTY="[]"
DIVERGED_COMMITS=$(curl --request GET --header "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" "https://gitlab.meishubao.com/api/v4/projects/${PROJECT_ID}/repository/compare?from=$1&to=master")
echo "${DIVERGED_COMMITS}"
DIVERGED_COMMITS_VALUE=$(parse_json $DIVERGED_COMMITS "commits")
echo "${CI_COMMIT_TAG}"

# 判断是否为空，不为空中断build
if [ "$MR_RESULT" != "$EMPTY" ];then
  echo '\033[31m MR扫描: 扫描到当前项目存在opened的MR，请将MR合并至master，再拉取最新代码生成Tag重新上线！(ERROR) \033[0m'
  # if [ "$DD" == 1 ];then
    # DD DATA
    # DATA="{'msgtype': 'markdown','markdown': {'title':'${DD_TITLE}','text': '#### **${DD_KEYWORD}**\n --- \n > - 构建项目: ${JOB_BASE_NAME} \n > -  构建分支: [${GIT_BRANCH}](${BUILD_URL}) \n > - 报错原因: ${DD_REASON} \n\n ${DD_AT_MOBILES_STRING}'},'at': {'isAtAll': ${DD_AT_ALL}, 'atMobiles':${DD_AT_MOBILES_ARRAY}}}"
    # DD API
    # curl "https://oapi.dingtalk.com/robot/send?access_token=${DD_TOKEN}" -H "Content-Type: application/json" -d "${DATA}"
  # fi
  # 中断！
  exit 1;
elif [ "$DIVERGED_COMMITS_VALUE" != "$EMPTY" ];then
  echo '\n检查对比: 检查部署tag存在落后于对应master的提交，拉取最新代码到上线分支进行上线！(ERROR)'
  # DATA="{\"msgtype\":\"markdown\",\"markdown\":{\"title\":\"[合并请求]\",\"text\":\"### [${DD_KEYWORD}] 部署失败， OPM 部署tag：$CI_COMMIT_TAG 存在落后提交，请拉取最新代码到上线分支进行上线！ ${DD_AT_MOBILES_STRING}\"},\"at\":{\"atMobiles\":${DD_AT_MOBILES_ARRAY},\"isAtAll\":${DD_AT_ALL}}}"
  # DD
  # curl -X POST -d "${DATA}" -H "Content-Type: application/json" "https://oapi.dingtalk.com/robot/send?access_token=${DD_TOKEN}"
  # 中断！
  exit 1;
else
  echo '\033[32m MR扫描: MR检查通过，未找到状态为opened的MR！(SUCCESS) \033[0m'
fi
