// 'use client'
import Image from "next/image";
import styles from './page.module.css';
// import { getPosts } from '../../lib/post';
import Apps from "./components/PageComp/PageComp";
import Header from "./components/Header/Header";
import { Metadata, ResolvingMetadata } from 'next';
// import { getMetadata } from '../../lib/metadata';
import Head from "next/head";
import PriceChartPage from "./PriceChart/page"

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   try {
//     const { slug } = params;
//     const response = await fetch(`https://ecometer-api.ceda.ashoka.edu.in/sections/metadata?slug=${slug}`);
//     const data = await response.json();

//     if (!data.status || data.type !== 'success') {
//       throw new Error('Failed to fetch metadata');
//     }

//     const { name, meta_description, meta_keywords } = data.data[0];
//     const canonicalUrl = `https://ecometer.ceda.ashoka.edu.in/${slug}`; // Replace with your actual domain

//     return {
//       title: name,
//       description: meta_description,
//       keywords: meta_keywords.split(', '),
//       openGraph: {
//         title: name,
//         description: meta_description,
//         url: canonicalUrl,
//         type: 'website',
//         // Add other Open Graph tags as needed
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title: name,
//         description: meta_description,
//         // Add other Twitter Card tags as needed
//       },
//       alternates: {
//         canonical: canonicalUrl,
//       },
      
//       robots: 'index, follow',
//     };
//   } catch (error) {
//     console.error('Error fetching metadata:', error);
//     return {
//       title: 'Error',
//       description: 'An error occurred while fetching metadata.',
//       keywords: [],
//     };
//   }
// }
// export async function generateStaticParams() {
//   const response = await fetch('https://ecometer-api.ceda.ashoka.edu.in/sections/getSectionsAndVariables');
//   const data = await response.json();

//   if (!data.status || data.type !== 'success') {
//     throw new Error('Failed to fetch sections data');
//   }

//   const sections = data.data;
//   const slugs = sections.flatMap(section => 
//     section.children.map(child => ({
//       slug: child.slug,
//     }))
//   );

//   return slugs;
// }

export default async function Page({ params, searchParams }: Props) {
  const { slug } = params;

  // Fetch posts and metadata
  // const { sectionList, defaultSelectedSection } = await getPosts();

  return (
    <div id="root">
      
      <Header />
      <div className={styles.pageContent}>
        <PriceChartPage />
        {/* <Apps SectionList={sectionList} /> */}
      </div>   
    </div>
  );
}
