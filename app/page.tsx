// 'use client'
import Image from "next/image";
import styles from './page.module.css';
// import { getPosts } from '../../lib/post';
import Header from "./components/Header/Header";
import { Metadata, ResolvingMetadata } from 'next';
// import { getMetadata } from '../../lib/metadata';
import Head from "next/head";
import PriceChartPage from "./PriceChart/page"

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};



export default async function Page({ params, searchParams }: Props) {
  const { slug } = params;

  // Fetch posts and metadata
  // const { sectionList, defaultSelectedSection } = await getPosts();

  return (
    <div id="root">
      
      <Header />
      <div className={styles.pageContent}>
        <PriceChartPage />

      </div>   
    </div>
  );
}
