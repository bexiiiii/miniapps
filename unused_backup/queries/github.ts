// GitHub functionality disabled for FoodSave app
export async function getGithubStars() {
  return null;
}
        );

        if (
          data?.repo?.stargazers_count !== undefined &&
          typeof data.repo.stargazers_count === "number"
        ) {
          return data.repo.stargazers_count;
        }
        console.warn("github api response format unexpected:", data);
        return null;
      } catch (error) {
        console.error("failed to fetch github stars:", error);
        return null;
      }
    },
    ["github-stars", SYSTEM_CONFIG.repoOwner, SYSTEM_CONFIG.repoName],
    {
      revalidate: 3600,
      tags: ["github-stars"],
    },
  )();
}
