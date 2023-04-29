<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import exportPdFs from "./export-pdf";
import data from "./data";
const form = reactive(data);
const downloading = ref(false);
const delTable = (type, index) => {
  const tableList = form[type];
  if (tableList.length == 1)
    return ElMessage.warning("最后一条数据无法删除哦！！！");
  tableList.splice(index, 1);
};
const addEducation = () => {
  form.educations.push({
    name: "",
    start_time: "",
    end_time: "",
    major: "",
    diploma: -1,
    descriptions: [],
  });
};
const addExperience = () => {
  form.experiences.push({
    name: "",
    start_time: "",
    end_time: "",
    position: "",
    performance: [],
  });
};
const addProject = () => {
  form.projects.push({
    name: "",
    start_time: "",
    end_time: "",
    major: "",
    address: "",
    // 项目背景显示模式，ol为有序列表（前面是数字），ul为无序列表（前面是圆点），p为段落
    backgroundMode: "p",
    background: "",
    performance: [],
  });
};
const changeDiploma = (value) => {
  if (value == 0) return "高中";
  else if (value == 1) return "大学专科";
  else if (value == 2) return "大学本科";
  else if (value == 3) return "硕士研究生";
  else if (value == 4) return "博士研究生";
  else return "";
};
const exportPDF = () => {
  try {
    downloading.value = true;
    exportPdFs.exportPdf(
      "downResume",
      form.info.name + "-" + form.info.jobIntention
    );
  } catch (err) {
    ElMessage.error("导出简历发生错误");
    downloading.value = false;
  } finally {
    downloading.value = false;
    ElMessage.success("导出简历成功");
  }
};
</script>

<template>
  <!-- 我的简历页面 -->
  <div class="container">
    <div class="title_name">
      <span>我的简历</span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-tabs style="height: auto">
        <!-- 基本信息模块 -->
        <el-tab-pane label="基本信息">
          <el-table
            :data="form.educations"
            stripe
            class="Table"
            style="width: 100%"
          >
            <el-table-column label="基本信息" width="auto">
              <el-row>
                <el-col>
                  <el-form :model="form" label-width="80px">
                    <el-row>
                      <el-col :lg="12" :md="12" :sm="24" :xs="24">
                        <el-form-item label="姓名">
                          <el-input v-model="form.info.name" />
                        </el-form-item>
                      </el-col>
                      <el-col :lg="12" :md="12" :sm="24" :xs="24">
                        <el-form-item label="求职意向">
                          <el-input v-model="form.info.jobIntention" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :lg="12" :md="12" :sm="24" :xs="24">
                        <el-form-item label="年龄">
                          <el-input v-model="form.info.age" />
                        </el-form-item>
                      </el-col>
                      <el-col :lg="12" :md="12" :sm="24" :xs="24">
                        <el-form-item label="性别">
                          <el-radio-group v-model="form.info.sex">
                            <el-radio label="男" />
                            <el-radio label="女" />
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :lg="12" :md="12" :sm="24" :xs="24">
                        <el-form-item label="联系方式">
                          <el-input v-model="form.info.tel" />
                        </el-form-item>
                      </el-col>
                      <el-col :lg="12" :md="12" :sm="24" :xs="24">
                        <el-form-item label="邮箱">
                          <el-input v-model="form.info.email" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="居住地">
                      <el-input v-model="form.info.home" />
                    </el-form-item>
                    <el-form-item label="专业技能">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 8 }"
                        v-model="form.skill.descriptions"
                        placeholder="请填写专业技能"
                      >
                      </el-input>
                    </el-form-item>
                    <el-form-item label="个人总结">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 8 }"
                        v-model="form.evaluate.word"
                        placeholder="请填写个人总结"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="教育经历">
          <el-table
            :data="form.educations"
            stripe
            class="Table"
            style="width: 100%"
          >
            <el-table-column label="教育经历" width="auto">
              <template #default="scope">
                <el-row>
                  <el-col>
                    <el-form ref="elForm" :model="scope.row" label-width="80px">
                      <el-row>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="学校">
                            <el-input
                              v-model="scope.row.name"
                              style="width: 100%"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="专业">
                            <el-input
                              v-model="scope.row.major"
                              style="width: 100%"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="开始日期">
                            <el-date-picker
                              type="month"
                              v-model="scope.row.start_time"
                              style="width: 100%"
                              placeholder="请选择开始日期"
                            >
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="结束日期">
                            <el-date-picker
                              type="month"
                              v-model="scope.row.end_time"
                              style="width: 100%"
                              placeholder="请选择结束日期"
                            >
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-col :lg="12" :md="12" :sm="24" :xs="24">
                        <el-form-item label="学历">
                          <el-select
                            style="width: 100%"
                            v-model="scope.row.diploma"
                            placeholder="请选择学历"
                          >
                            <el-option
                              v-for="item in [
                                {
                                  value: 0,
                                  label: '高中',
                                },
                                {
                                  value: 1,
                                  label: '大学专科',
                                },
                                {
                                  value: 2,
                                  label: '大学本科',
                                },
                                {
                                  value: 3,
                                  label: '硕士研究生',
                                },
                                {
                                  value: 4,
                                  label: '博士研究生',
                                },
                              ]"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                              clearable
                              style="width: 100%"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="描述">
                          <el-input
                            v-model="scope.row.descriptions"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 4 }"
                            style="width: 100%"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-col>
                </el-row>
                <el-row justify="end">
                  <el-col :span="5">
                    <el-button
                      @click="delTable('educations', scope.$index)"
                      type="primary"
                      round
                      plain
                      >删除</el-button
                    >
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addEducation()" type="primary" class="btn" round
            >新增教育经历</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="工作经历">
          <el-table
            :data="form.experiences"
            stripe
            class="Table"
            style="width: 100%"
          >
            <el-table-column label="工作经历" width="auto">
              <template #default="scope">
                <el-row>
                  <el-col>
                    <el-form ref="elForm" :model="scope.row" label-width="80px">
                      <el-row>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="公司名称">
                            <el-input
                              v-model="scope.row.name"
                              style="width: 100%"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="职位">
                            <el-input
                              v-model="scope.row.position"
                              style="width: 100%"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="开始日期">
                            <el-date-picker
                              type="month"
                              v-model="scope.row.start_time"
                              style="width: 100%"
                              placeholder="请选择开始日期"
                            >
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="结束日期">
                            <el-date-picker
                              type="month"
                              v-model="scope.row.end_time"
                              style="width: 100%"
                              placeholder="请选择结束日期"
                            >
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-col :span="24">
                        <el-form-item label="工作描述">
                          <el-input
                            v-model="scope.row.performance"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 4 }"
                            style="width: 100%"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-col>
                </el-row>
                <el-row justify="end">
                  <el-col :span="5">
                    <el-button
                      @click="delTable('experiences', scope.$index)"
                      type="primary"
                      round
                      plain
                      >删除</el-button
                    >
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addExperience()" type="primary" class="btn" round
            >新增工作经历</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="项目经历">
          <el-table
            :data="form.projects"
            stripe
            class="Table"
            style="width: 100%"
          >
            <el-table-column label="项目经历" width="auto">
              <template #default="scope">
                <el-row>
                  <el-col>
                    <el-form ref="elForm" :model="scope.row" label-width="80px">
                      <el-row>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="项目名称">
                            <el-input
                              v-model="scope.row.name"
                              style="width: 100%"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="项目地址">
                            <el-input
                              v-model="scope.row.address"
                              style="width: 100%"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="开始日期">
                            <el-date-picker
                              type="month"
                              v-model="scope.row.start_time"
                              style="width: 100%"
                              placeholder="请选择开始日期"
                            >
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :lg="12" :md="12" :sm="24" :xs="24">
                          <el-form-item label="结束日期">
                            <el-date-picker
                              type="month"
                              v-model="scope.row.end_time"
                              style="width: 100%"
                              placeholder="请选择结束日期"
                            >
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-col :span="24">
                        <el-form-item label="项目背景">
                          <el-input
                            v-model="scope.row.background"
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 3 }"
                            style="width: 100%"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="项目描述">
                          <el-input
                            v-model="scope.row.performance"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 4 }"
                            style="width: 100%"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-col>
                </el-row>
                <el-row justify="end">
                  <el-col :span="5">
                    <el-button
                      @click="delTable('projects', scope.$index)"
                      type="primary"
                      round
                      plain
                      >删除</el-button
                    >
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addProject()" type="primary" class="btn" round
            >新增项目经历</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="简历预览">
          <el-button
            round
            type="primary"
            style="margin-bottom: 10px"
            @click="exportPDF()"
            v-loading="downloading"
            >导出简历</el-button
          >
          <div class="index">
            <div id="downResume">
              <div class="resume">
                <!-- 基本信息 -->
                <div class="info">
                  <div class="info_left_img">
                    <img src="../../public/logo.webp" size="120" class="aa" />
                  </div>
                  <div class="info-right">
                    <div class="info_name">
                      <h1>{{ form.info.name }}</h1>
                      <span>{{ form.info.jobIntention }}</span>
                    </div>
                    <div class="info_other">
                      <el-row>
                        <el-col :span="12">
                          <MyIcon name="xingbie" />
                          {{ form.info.sex }}
                        </el-col>
                        <el-col :span="12">
                          <MyIcon name="nianling" />
                          {{ form.info.age }}
                        </el-col>
                        <el-col :span="12">
                          <MyIcon name="31dianhua" />
                          {{ form.info.tel }}
                        </el-col>
                        <el-col :span="12">
                          <MyIcon name="youxiang" />
                          {{ form.info.email }}
                        </el-col>
                        <el-col :span="12">
                          <MyIcon name="dizhi" />
                          {{ form.info.home }}
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>

                <!-- 教育经历 -->
                <div class="education">
                  <Title title="教育背景" />
                  <div class="main">
                    <div
                      class="content_top"
                      v-for="(item, index) in form.educations"
                      :key="index"
                    >
                      <el-row :gutter="20">
                        <el-col :span="6">
                          <span>{{ item.name }}</span>
                        </el-col>
                        <el-col :span="6">
                          <span>{{ item.major }}</span>
                        </el-col>
                        <el-col :span="5">
                          <span>{{ changeDiploma(item.diploma) }}</span>
                        </el-col>
                        <el-col :span="5" :offset="2" class="time">
                          <span>{{ item.start_time }}-{{ item.end_time }}</span>
                        </el-col>
                      </el-row>
                      <Content :data="item.descriptions" mode="ul" />
                    </div>
                  </div>
                </div>

                <!-- 专业技能 -->
                <div class="skill" v-if="form.skill.descriptions.length">
                  <Title title="专业技能" />
                  <div class="main">
                    <Content
                      :data="form.skill.descriptions"
                      :mode="form.skill.skillsMode"
                    />
                  </div>
                </div>

                <!-- 实习经历 -->
                <div class="internship" v-if="form.experiences.length">
                  <Title title="实习经历" />
                  <div class="main">
                    <div
                      class="content_top"
                      v-for="(experience, index) in form.experiences"
                      :key="index"
                    >
                      <el-row :gutter="20">
                        <el-col :span="10">
                          <span class="weight">{{ experience.name }}</span>
                        </el-col>
                        <el-col :span="5">
                          <span>{{ experience.position }}</span>
                        </el-col>
                        <el-col :span="5" :offset="4" class="time">
                          <span
                            >{{ experience.start_time }}-{{
                              experience.end_time
                            }}</span
                          >
                        </el-col>
                      </el-row>
                      <Content :data="experience.performance" mode="ul" />
                    </div>
                  </div>
                </div>

                <!-- 项目经历 -->
                <div class="projects" v-if="form.projects.length">
                  <Title title="项目经历" />
                  <div class="main">
                    <div
                      class="content_top"
                      v-for="(project, index) in form.projects"
                      :key="index"
                    >
                      <el-row :gutter="20">
                        <el-col :span="10">
                          <span class="project_name weight">
                            {{ project.name }}
                          </span>
                        </el-col>
                        <el-col :span="5" :offset="9" class="time">
                          <span
                            >{{ project.start_time }}-{{
                              project.end_time
                            }}</span
                          >
                        </el-col>
                        <el-col :span="24">
                          <span class="weight">项目地址：</span>
                          <span>{{ project.address }}</span>
                        </el-col>
                      </el-row>
                      <div class="weight">项目背景：</div>
                      <Content
                        :data="project.background"
                        :mode="project.backgroundMode"
                      />
                      <div class="weight">项目描述：</div>
                      <Content :data="project.performance" mode="ul" />
                    </div>
                  </div>
                </div>

                <!-- 个人评价 -->
                <div class="evaluate" v-if="form.evaluate">
                  <Title title="个人评价" />
                  <div class="main">
                    <Content
                      :data="form.evaluate.word"
                      :mode="form.evaluate.wordMode"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}
.container {
  .title_name {
    height: 59px;
    line-height: 59px;
    color: var(--theme-color);
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
  }
  .wrap {
    padding: 20px;
  }
  .Table {
    :deep(table) {
      margin: 0;
    }
  }
  .btn {
    margin-top: 1rem;
  }
  .index {
    border: 1px solid var(--theme-color);
    border-radius: 25px;
  }
  #downResume {
    margin: 20px auto;
    .aa {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
    }

    .aa img {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      height: 100%;
    }

    .resume {
      margin: 0 auto;
      padding: 20px 20px;
      border-radius: 10px;
      line-height: 28px;
      .weight {
        font-weight: 500;
      }

      .main {
        padding: 20px 12px 30px 12px;
      }

      .time {
        span {
          color: #a8a8a8;
        }
      }

      .info {
        margin-bottom: 0px;
      }

      .info {
        display: flex;
        align-items: center;

        .info_left_img {
          ::v-deep img {
            width: 100%;
          }
        }

        .info-right {
          width: 500px;
          margin-left: 50px;
        }

        &_name {
          line-height: 80px;
          display: flex;

          h1 {
            font-size: 32px;
          }

          span {
            margin-left: 15px;
            font-size: 14px;
          }
        }

        &_other {
          ::v-deep .el-descriptions__cell {
            padding-right: 35px;
          }

          i {
            color: #c0c4cc;
            font-size: 15px;
            margin-right: 10px;
          }
        }
      }

      .projects {
        .project_name {
          letter-spacing: 1px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
