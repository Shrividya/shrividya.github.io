---
layout: post
title: "Getting Started with Apache Airflow: A Practical Guide"
date: 2025-01-15
tags: [airflow, data-engineering, python]
description: A hands-on walkthrough of DAG authoring, scheduling, and best practices for production Airflow pipelines.
---

Apache Airflow is the industry standard for orchestrating data pipelines. Think of it like a traffic controller for your data — it decides what runs, when it runs, and what happens if something goes wrong.

## What is a DAG?

A DAG (Directed Acyclic Graph) is just a fancy term for a pipeline where tasks run in a defined order, without loops. Like a recipe — you can't frost a cake before baking it.

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

def extract():
    print("Extracting data...")

def transform():
    print("Transforming data...")

with DAG(
    dag_id="my_first_dag",
    start_date=datetime(2024, 1, 1),
    schedule="@daily",
    catchup=False,
) as dag:

    extract_task = PythonOperator(
        task_id="extract",
        python_callable=extract,
    )

    transform_task = PythonOperator(
        task_id="transform",
        python_callable=transform,
    )

    extract_task >> transform_task  # extract runs first, then transform
```

## Key Concepts

**Tasks** are the individual steps — like ingredients in your recipe.

**Operators** are the task types — Python, Bash, SQL, HTTP, and hundreds more.

**Connections** store credentials securely so your DAGs can talk to databases, APIs, and cloud services.

## Best Practices

1. Keep tasks small and focused — one task, one job
2. Use `catchup=False` unless you specifically need backfills
3. Store secrets in Airflow Connections, never hardcode them
4. Always set `retries` for production DAGs

---

*Want to go deeper? Check out the [official Airflow docs](https://airflow.apache.org/docs/) or reach out on [LinkedIn](https://www.linkedin.com/in/shrividya-hegde-shri-91562365/).*
