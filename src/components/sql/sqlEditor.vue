<template>
  <div id="container" style="height: 100%; width: 100%"></div>
</template>
<script setup>
import {
  setupLanguageFeatures,
  LanguageIdEnum,
  EntityContextType,
  LanguageServiceDefaultsImpl,
} from "monaco-sql-languages";

import "monaco-sql-languages/esm/languages/mysql/mysql.contribution";
import "monaco-sql-languages/esm/languages/flink/flink.contribution";
import "monaco-sql-languages/esm/languages/spark/spark.contribution";
import "monaco-sql-languages/esm/languages/hive/hive.contribution";
import "monaco-sql-languages/esm/languages/trino/trino.contribution";
import "monaco-sql-languages/esm/languages/pgsql/pgsql.contribution";
import "monaco-sql-languages/esm/languages/impala/impala.contribution";
import { language } from "monaco-editor/esm/vs/basic-languages/sql/sql.js";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import FlinkSQLWorker from "monaco-sql-languages/esm/languages/flink/flink.worker?worker";
import { language as flinkLanguage } from "monaco-sql-languages/esm/languages/flink/flink.js";
import SparkSQLWorker from "monaco-sql-languages/esm/languages/spark/spark.worker?worker";
import HiveSQLWorker from "monaco-sql-languages/esm/languages/hive/hive.worker?worker";
import PGSQLWorker from "monaco-sql-languages/esm/languages/pgsql/pgsql.worker?worker";
import MySQLWorker from "monaco-sql-languages/esm/languages/mysql/mysql.worker?worker";
import TrinoSQLWorker from "monaco-sql-languages/esm/languages/trino/trino.worker?worker";
import ImpalaSQLWorker from "monaco-sql-languages/esm/languages/impala/impala.worker?worker";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { vsPlusTheme } from "monaco-sql-languages";
import { nextTick, ref, onBeforeUnmount } from "vue";

monaco.languages.register({ id: LanguageIdEnum.FLINK });
const cs = function (
  model,
  position,
  completionContext,
  suggestions, // 语法推荐信息
  entities // 当前编辑器文本的语法上下文中出现的表名、字段名等
) {
  return new Promise((resolve, reject) => {
    console.log("关键词提示");

    if (!suggestions) {
      return Promise.resolve([]);
    }
    const { keywords, syntax } = suggestions;
    const keywordsCompletionItems = keywords.map((kw) => ({
      label: kw,
      kind: monaco.languages.CompletionItemKind.Keyword,
      detail: "keyword",
      sortText: "2" + kw,
    }));

    let syntaxCompletionItems = [];

    syntax.forEach((item) => {
      if (item.syntaxContextType === EntityContextType.DATABASE) {
        const databaseCompletions = []; // some completions about databaseName
        syntaxCompletionItems = [
          ...syntaxCompletionItems,
          ...databaseCompletions,
        ];
      }
      if (item.syntaxContextType === EntityContextType.TABLE) {
        const tableCompletions = []; // some completions about tableName
        syntaxCompletionItems = [...syntaxCompletionItems, ...tableCompletions];
      }
    });

    resolve([...syntaxCompletionItems, ...keywordsCompletionItems]);
  });
};

setupLanguageFeatures(LanguageIdEnum.FLINK, {
  completionItems: {
    enable: true,
    triggerCharacters: [" ", "."],
    completionService: cs,
  },
});
const emitter = new monaco.Emitter();
let mc = Object.create({
  completionItems: {
    enable: true,
  },
  hovers: true,
  documentSymbols: true,
  definitions: true,
  references: true,
  documentHighlights: true,
  rename: true,
  colors: true,
  foldingRanges: true,
  diagnostics: true,
  selectionRanges: true,
});

let flinkDefaults = new LanguageServiceDefaultsImpl(
  LanguageIdEnum.FLINK,
  mc,
  null
);
// const flinkDefaults = {
//   languageId: LanguageIdEnum.FLINK,
//   diagnosticDefault: {
//     validate: true,
//   },
//   onDidChange: () => {
//     return emitter.event;
//   },
//   modeConfiguration: {
//     completionItems: {
//       enable: true,
//     },
//     hovers: true,
//     documentSymbols: true,
//     definitions: true,
//     references: true,
//     documentHighlights: true,
//     rename: true,
//     colors: true,
//     foldingRanges: true,
//     diagnostics: true,
//     selectionRanges: true,
//   },
// };
monaco.languages.onLanguage(LanguageIdEnum.FLINK, () => {
  console.log("onLanguage");
  /**
   * 设置/初始化 language 相关的功能
   */
  import("monaco-sql-languages/esm/setupLanguageMode").then((mode) => {
    console.log("mode", mode);
    mode.setupLanguageMode(flinkDefaults);
  });
});

// 设置SQL语言的tokens（词法分析）
monaco.languages.setMonarchTokensProvider(LanguageIdEnum.FLINK, flinkLanguage);

window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === LanguageIdEnum.FLINK) {
      return new FlinkSQLWorker();
    }
    if (label === LanguageIdEnum.HIVE) {
      return new HiveSQLWorker();
    }
    if (label === LanguageIdEnum.SPARK) {
      return new SparkSQLWorker();
    }
    if (label === LanguageIdEnum.PG) {
      return new PGSQLWorker();
    }
    if (label === LanguageIdEnum.MYSQL) {
      return new MySQLWorker();
    }
    if (label === LanguageIdEnum.TRINO) {
      return new TrinoSQLWorker();
    }
    if (label === LanguageIdEnum.IMPALA) {
      return new ImpalaSQLWorker();
    }
    return new EditorWorker();
  },
};

monaco.editor.defineTheme("sql-dark", vsPlusTheme.darkThemeData);
monaco.editor.defineTheme("sql-light", vsPlusTheme.lightThemeData);
monaco.editor.defineTheme("sql-hc", vsPlusTheme.hcBlackThemeData);

let editor = null;
const editorInit = () => {
  nextTick(() => {
    monaco.languages.registerCompletionItemProvider(LanguageIdEnum.FLINK, {
      // 触发条件，也可以不写，不写的话只要输入满足label就会提示
      // 只能配置单字符
      // triggerCharacters: [" "],
      provideCompletionItems: (model, position, context, token) => {
        const word = model.getWordUntilPosition(position);
        console.log("1111");
        let suggestions = [];
        // language.keywords 是获取内置的SQL关键字
        language.keywords.foreach((item) => {
          suggestions.push({
            label: item,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: item,
            detail: "内置关键字",
          });
        });
        return {
          suggestions: suggestions.filter((suggestion) =>
            suggestion.label.toLowerCase().startsWith(word.word.toLowerCase())
          ),
        };
      },
    });

    editor = monaco.editor.create(document.getElementById("container"), {
      theme: "sql-dark",
      value: "select * from tb_test",
      language: LanguageIdEnum.FLINK, // languageId
      readOnly: false,
      selectOnLineNumbers: true,
      renderSideBySide: false,
    });
    monaco.editor.setModelLanguage(editor.getModel(), LanguageIdEnum.FLINK);
  });
};

onMounted(() => {
  editorInit();
});
</script>
